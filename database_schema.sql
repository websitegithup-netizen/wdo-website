-- =================================================================================
-- WDO PORTAL DATABASE SCHEMA (Supabase PostgreSQL) - MULTI-ROLE SYSTEM (RBAC)
-- =================================================================================

-- 1. CLEANUP
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.is_editor() CASCADE;

-- 2. CREATE PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Viewer', -- Super Admin, Editor, Viewer
  status TEXT NOT NULL DEFAULT 'Active',
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ENABLE RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. RBAC HELPER FUNCTIONS (SECURITY DEFINER)
-- SUPER ADMIN: Full Control
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'Super Admin' AND status = 'Active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- EDITOR: Can manage content (Posts, Programs, iwm)
CREATE OR REPLACE FUNCTION public.is_editor()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('Super Admin', 'Editor') AND status = 'Active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. POLICIES FOR 'profiles' (Only Super Admins can manage users)
DROP POLICY IF EXISTS "Allow authenticated users to read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow Super Admins to manage profiles" ON public.profiles;
CREATE POLICY "Allow authenticated users to read profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow Super Admins to manage profiles" ON public.profiles FOR ALL TO authenticated USING (public.is_admin());

-- 6. POLICIES FOR CONTENT TABLES (Editors & Admins can manage)

-- Programs
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view programs" ON public.programs;
DROP POLICY IF EXISTS "Editors can manage programs" ON public.programs;
CREATE POLICY "Public can view programs" ON public.programs FOR SELECT USING (true);
CREATE POLICY "Editors can manage programs" ON public.programs FOR ALL TO authenticated USING (public.is_editor());

-- Posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view posts" ON public.posts;
DROP POLICY IF EXISTS "Editors can manage posts" ON public.posts;
CREATE POLICY "Public can view posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Editors can manage posts" ON public.posts FOR ALL TO authenticated USING (public.is_editor());

-- Gallery
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view gallery" ON public.gallery;
DROP POLICY IF EXISTS "Editors can manage gallery" ON public.gallery;
CREATE POLICY "Public can view gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Editors can manage gallery" ON public.gallery FOR ALL TO authenticated USING (public.is_editor());

-- Impact Reports
ALTER TABLE public.impact_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view impact" ON public.impact_reports;
DROP POLICY IF EXISTS "Editors can manage impact" ON public.impact_reports;
CREATE POLICY "Public can view impact" ON public.impact_reports FOR SELECT USING (true);
CREATE POLICY "Editors can manage impact" ON public.impact_reports FOR ALL TO authenticated USING (public.is_editor());

-- Messages (Only Admins/Editors should see these)
ALTER TABLE public.contacts_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Editors can manage messages" ON public.contacts_messages;
CREATE POLICY "Editors can manage messages" ON public.contacts_messages FOR ALL TO authenticated USING (public.is_editor());

-- 7. SYNC TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, status)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'), 
    COALESCE(NEW.raw_user_meta_data->>'role', 'Viewer'),
    'Active'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 8. GRANTS
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
