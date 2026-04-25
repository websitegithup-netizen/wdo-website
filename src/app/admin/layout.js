'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { 
  LayoutDashboard, Users, FileText, Settings, 
  LogOut, Menu, X, Bell, Search, User,
  ChevronDown, Globe, Moon, Sun, Briefcase, 
  Image as ImageIcon, MessageSquare, BarChart3,
  Shield, ExternalLink, Layout as SliderIcon
} from 'lucide-react'

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [theme, setTheme] = useState('light')
  const [language, setLanguage] = useState('en')
  const [currentUser, setCurrentUser] = useState({ name: 'Admin', email: 'user@wdo.org', role: 'Viewer' })

  // 1. Initial Sync & Auth Check
  useEffect(() => {
    const syncSystem = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Fetch real name and role from profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, role')
          .eq('id', user.id)
          .single()
          
        setCurrentUser({
          name: profile?.name || user.user_metadata?.name || 'Admin User',
          email: user.email,
          role: profile?.role || 'Viewer'
        })

        // Immediate login update
        await supabase
          .from('profiles')
          .update({ last_login: new Date().toISOString() })
          .eq('id', user.id)

        if (user.user_metadata) {
          if (user.user_metadata.theme) setTheme(user.user_metadata.theme)
          if (user.user_metadata.language) setLanguage(user.user_metadata.language)
        }
      } else {
        router.push('/login')
      }
      
      // Fetch unread messages count
      const { count } = await supabase.from('contacts_messages').select('id', { count: 'exact', head: true })
      setUnreadCount(count || 0)
      
      setLoading(false)
    }
    syncSystem()
  }, [pathname, router])

  // 2. Real-time Heartbeat (Updates last_login every 2 mins)
  useEffect(() => {
    if (!currentUser.email || currentUser.email === 'user@wdo.org') return

    const updateHeartbeat = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from('profiles')
          .update({ last_login: new Date().toISOString() })
          .eq('id', user.id)
      }
    }

    const heartbeat = setInterval(updateHeartbeat, 3000)
    return () => clearInterval(heartbeat)
  }, [currentUser.email])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const translations = {
    en: {
      dashboard: 'Dashboard',
      content: 'CONTENT MANAGEMENT',
      programs: 'Programs',
      blog: 'Blog Posts',
      slider: 'Hero Slider',
      gallery: 'Media Gallery',
      audience: 'AUDIENCE & IMPACT',
      impact: 'Impact Reports',
      inbox: 'Inbox & Messages',
      system: 'SYSTEM & ADMIN',
      users: 'User Roles & Access',
      settings: 'System Settings',
      profile: 'My Profile',
      logout: 'Sign Out',
      portal: 'WDO Workspace',
      dir: 'ltr'
    }
  }

  const t = translations[language] || translations.en

  const menuGroups = [
    {
      title: 'OVERVIEW',
      items: [
        { name: t.dashboard, icon: <LayoutDashboard size={18} />, path: '/admin' }
      ]
    },
    {
      title: t.content,
      items: [
        { name: t.programs, icon: <Briefcase size={18} />, path: '/admin/programs' },
        { name: t.blog, icon: <FileText size={18} />, path: '/admin/posts' },
        { name: t.slider, icon: <SliderIcon size={18} />, path: '/admin/slider' },
        { name: t.gallery, icon: <ImageIcon size={18} />, path: '/admin/gallery' }
      ]
    },
    {
      title: t.audience,
      items: [
        { name: t.impact, icon: <BarChart3 size={18} />, path: '/admin/impact' },
        { name: t.inbox, icon: <MessageSquare size={18} />, path: '/admin/messages', badge: unreadCount }
      ]
    },
    {
      title: t.system,
      items: [
        { name: t.profile, icon: <User size={18} />, path: '/admin/profile' },
        ...(currentUser.role === 'Super Admin' ? [
          { name: t.users, icon: <Users size={18} />, path: '/admin/users' },
          { name: t.settings, icon: <Settings size={18} />, path: '/admin/settings' }
        ] : [])
      ]
    }
  ]

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTop: '4px solid #0056b3', borderRadius: '50%', margin: '0 auto 20px' }}></div>
          <p style={{ fontWeight: '800', color: '#64748b', fontSize: '0.9rem' }}>Initializing Workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', color: '#1e293b', direction: t.dir }} className="admin-root">
      
      {/* Sidebar */}
      <aside style={{ 
        width: isSidebarOpen ? '280px' : '0', 
        backgroundColor: 'white', 
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'fixed',
        height: '100vh',
        zIndex: 1000,
        overflow: 'hidden'
      }}>
        {/* Sidebar Header */}
        <div style={{ padding: '25px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ backgroundColor: '#0056b3', color: 'white', padding: '8px', borderRadius: '10px' }}>
            <Briefcase size={22} />
          </div>
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <div style={{ fontWeight: '900', fontSize: '1.1rem', color: '#1e293b' }}>WDO</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '800', letterSpacing: '0.5px' }}>ADMINISTRATION</div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '20px 15px' }}>
          {menuGroups.map((group, idx) => (
            <div key={idx} style={{ marginBottom: '25px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: '900', color: '#94a3b8', padding: '0 15px 10px', letterSpacing: '1px' }}>{group.title}</div>
              {group.items.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.path}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px',
                    borderRadius: '12px', textDecoration: 'none', color: pathname === item.path ? '#0056b3' : '#64748b',
                    backgroundColor: pathname === item.path ? '#eff6ff' : 'transparent',
                    fontWeight: pathname === item.path ? '800' : '600', fontSize: '0.9rem',
                    marginBottom: '4px', transition: 'all 0.2s'
                  }}
                >
                  <span style={{ opacity: pathname === item.path ? 1 : 0.7 }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.name}</span>
                  {item.badge > 0 && (
                    <span style={{ backgroundColor: '#ef4444', color: 'white', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '10px' }}>{item.badge}</span>
                  )}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer (User Info) */}
        <div style={{ padding: '20px', borderTop: '1px solid #f1f5f9', backgroundColor: '#fcfcfc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#0056b3', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1rem', boxShadow: '0 4px 10px rgba(0,86,179,0.2)' }}>
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: '800', fontSize: '0.85rem', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.name}</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.email}</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '10px', backgroundColor: '#fff1f2', color: '#e11d48', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer', transition: 'background-color 0.2s' }}
          >
            <LogOut size={16} /> {t.logout}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ 
        flex: 1, 
        marginLeft: isSidebarOpen ? '280px' : '0',
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Top Header */}
        <header style={{ 
          height: '70px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px',
          position: 'sticky', top: 0, zIndex: 900
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '10px', color: '#64748b', cursor: 'pointer' }}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div style={{ position: 'relative', width: '300px' }} className="hidden-mobile">
              <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Search programs, posts, messages..." 
                style={{ width: '100%', padding: '10px 15px 10px 45px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '10px', color: '#64748b', cursor: 'pointer' }}><Bell size={20} /></button>
              <button style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '10px', color: '#64748b', cursor: 'pointer' }}><Globe size={20} /></button>
            </div>
            <div style={{ width: '1px', height: '25px', backgroundColor: '#e2e8f0', margin: '0 5px' }}></div>
            <Link href="/admin/profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <div style={{ width: '35px', height: '35px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#0056b3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.9rem' }}>
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden-mobile" style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '800', fontSize: '0.8rem', color: '#1e293b', lineHeight: '1' }}>{currentUser.name}</div>
                <div style={{ fontSize: '0.65rem', color: '#16a34a', fontWeight: '800', marginTop: '3px' }}>{currentUser.role}</div>
              </div>
            </Link>
          </div>
        </header>

        {/* Content Wrapper */}
        <div style={{ padding: '40px', flex: 1 }}>
          {children}
        </div>

        {/* Footer */}
        <footer style={{ padding: '20px 40px', borderTop: '1px solid #e2e8f0', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700' }}>
            © {new Date().getFullYear()} WDO Administration. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '6px', height: '6px', backgroundColor: '#22c55e', borderRadius: '50%' }}></div> API Online</span>
            <span>v1.0.4 Premium</span>
          </div>
        </footer>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .admin-root aside { position: fixed; left: 0; top: 0; }
        }
      `}} />
    </div>
  )
}
