-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM for roles
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'viewer');
CREATE TYPE content_status AS ENUM ('draft', 'published');
CREATE TYPE program_category AS ENUM ('education', 'health', 'youth', 'environment');

-- 1. Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role user_role DEFAULT 'viewer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Programs Table
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category program_category NOT NULL,
  description TEXT,
  impact_metrics JSONB DEFAULT '{}'::jsonb,
  status content_status DEFAULT 'draft',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- 3. Posts Table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  status content_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 4. Impact Reports Table
CREATE TABLE impact_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE impact_reports ENABLE ROW LEVEL SECURITY;

-- 5. Contacts/Messages Table
CREATE TABLE contacts_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE contacts_messages ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function to check if user is editor
CREATE OR REPLACE FUNCTION is_editor() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update profiles" ON profiles FOR UPDATE USING (is_admin());

-- Programs Policies
CREATE POLICY "Public can view published programs" ON programs FOR SELECT USING (status = 'published');
CREATE POLICY "Editors/Admins can view all programs" ON programs FOR SELECT USING (is_editor());
CREATE POLICY "Editors/Admins can insert programs" ON programs FOR INSERT WITH CHECK (is_editor());
CREATE POLICY "Editors/Admins can update programs" ON programs FOR UPDATE USING (is_editor());
CREATE POLICY "Admins can delete programs" ON programs FOR DELETE USING (is_admin());

-- Posts Policies
CREATE POLICY "Public can view published posts" ON posts FOR SELECT USING (status = 'published');
CREATE POLICY "Editors/Admins can view all posts" ON posts FOR SELECT USING (is_editor());
CREATE POLICY "Editors/Admins can insert posts" ON posts FOR INSERT WITH CHECK (is_editor());
CREATE POLICY "Editors/Admins can update posts" ON posts FOR UPDATE USING (is_editor());
CREATE POLICY "Admins can delete posts" ON posts FOR DELETE USING (is_admin());

-- Impact Reports Policies
CREATE POLICY "Public can view impact reports" ON impact_reports FOR SELECT USING (true);
CREATE POLICY "Editors/Admins can insert impact reports" ON impact_reports FOR INSERT WITH CHECK (is_editor());
CREATE POLICY "Editors/Admins can update impact reports" ON impact_reports FOR UPDATE USING (is_editor());
CREATE POLICY "Admins can delete impact reports" ON impact_reports FOR DELETE USING (is_admin());

-- Contacts Messages Policies
CREATE POLICY "Public can insert messages" ON contacts_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view messages" ON contacts_messages FOR SELECT USING (is_admin());
CREATE POLICY "Admins can delete messages" ON contacts_messages FOR DELETE USING (is_admin());

-- ==========================================
-- AUTOMATIC PROFILE CREATION TRIGGER
-- ==========================================
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'viewer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
