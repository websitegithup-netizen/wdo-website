import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Initialize Supabase admin client with service role key
// This bypasses RLS and allows creating users without logging out the current admin
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(req) {
  try {
    const body = await req.json()
    const { email, password, name, role, status } = body

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY === 'your_service_role_key_here') {
      return NextResponse.json(
        { error: 'Missing SUPABASE_SERVICE_ROLE_KEY. Fadlan ku dar faylka .env.local si aad u samayso akoon.' }, 
        { status: 500 }
      )
    }

    // 1. Create the user in Supabase Auth (This will send a confirmation email if enabled in Supabase settings)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: { name, role }
    })

    if (authError) throw authError

    // 2. Upsert into the public.profiles table
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert([
        {
          id: authData.user.id,
          name,
          email,
          role,
          status,
          last_login: null
        }
      ], { onConflict: 'id' })

    if (profileError) {
      // If profile creation fails, we should ideally delete the auth user to prevent orphaned accounts, 
      // but for this implementation, we will just throw the error.
      throw profileError
    }

    return NextResponse.json({ success: true, user: authData.user })

  } catch (error) {
    console.error('Create User API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
