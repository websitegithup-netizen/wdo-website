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
  const [currentUser, setCurrentUser] = useState({ name: 'Admin', email: 'user@wdo.org', role: 'Viewer', avatar_url: null })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 1024)
    checkScreen()
    window.addEventListener('resize', checkScreen)
    return () => window.removeEventListener('resize', checkScreen)
  }, [])

  // 1. Initial Sync & Auth Check
  useEffect(() => {
    const syncSystem = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Fetch real name, role, recent_sessions, and avatar_url from profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, role, recent_sessions, avatar_url')
          .eq('id', user.id)
          .single()
          
        setCurrentUser({
          name: profile?.name || user.user_metadata?.name || 'Admin User',
          email: user.email,
          role: profile?.role || 'Viewer',
          avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url || null
        })

        // Immediate login update & Session tracking
        const userAgent = window.navigator.userAgent
        const deviceName = /Macintosh/.test(userAgent) ? 'Mac' : /Windows/.test(userAgent) ? 'Windows PC' : /iPhone/.test(userAgent) ? 'iPhone' : /Android/.test(userAgent) ? 'Android' : 'Device'
        const browserName = /Chrome/.test(userAgent) && !/Edge/.test(userAgent) ? 'Chrome' : /Safari/.test(userAgent) && !/Chrome/.test(userAgent) ? 'Safari' : /Firefox/.test(userAgent) ? 'Firefox' : /Edge/.test(userAgent) ? 'Edge' : 'Browser'
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown Location'
        
        const currentSession = {
          device: `${deviceName} - ${browserName}`,
          location: timezone,
          time: new Date().toISOString()
        }

        let sessions = profile?.recent_sessions || []
        // Filter out identical sessions (same device and location) to prevent duplicates
        sessions = sessions.filter(s => s.device !== currentSession.device || s.location !== currentSession.location)
        sessions.unshift(currentSession) // Add to top
        if (sessions.length > 3) sessions.pop() // Keep only last 3

        await supabase
          .from('profiles')
          .update({ 
            last_login: new Date().toISOString(),
            recent_sessions: sessions
          })
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

    window.addEventListener('profileUpdated', syncSystem)
    return () => window.removeEventListener('profileUpdated', syncSystem)
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
      team: 'Our Team',
      gallery: 'Media Gallery',
      network: 'Network & Events',
      audience: 'AUDIENCE & IMPACT',
      impact: 'Impact Reports',
      inbox: 'Inbox & Messages',
      system: 'SYSTEM & ADMIN',
      users: 'User Roles & Access',
      settings: 'System Settings',
      subscriptions: 'Newsletter Subscriptions',
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
        { name: t.team, icon: <Users size={18} />, path: '/admin/team' },
        { name: t.gallery, icon: <ImageIcon size={18} />, path: '/admin/gallery' },
        { name: t.network, icon: <Globe size={18} />, path: '/admin/network' }
      ]
    },
    {
      title: t.audience,
      items: [
        { name: t.impact, icon: <BarChart3 size={18} />, path: '/admin/impact' },
        { name: t.inbox, icon: <MessageSquare size={18} />, path: '/admin/messages', badge: unreadCount },
        { name: t.subscriptions, icon: <Bell size={18} />, path: '/admin/subscriptions' }
      ]
    },
    {
      title: t.system,
      items: [
        { name: t.settings, icon: <Settings size={18} />, path: '/admin/settings' },
        ...(currentUser.role === 'Super Admin' ? [
          { name: t.users, icon: <Users size={18} />, path: '/admin/users' }
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
                  onClick={() => { if (isMobile) setIsSidebarOpen(false) }}
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
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#0056b3', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1rem', boxShadow: '0 4px 10px rgba(0,86,179,0.2)', overflow: 'hidden', flexShrink: 0 }}>
              {currentUser.avatar_url ? (
                <img src={currentUser.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                currentUser.name.charAt(0).toUpperCase()
              )}
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

      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 999, backdropFilter: 'blur(2px)' }}
        />
      )}

      {/* Main Content Area */}
      <main style={{ 
        flex: 1, 
        marginLeft: (isSidebarOpen && !isMobile) ? '280px' : '0',
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        width: isMobile ? '100%' : 'auto'
      }}>
        {/* Top Header */}
        <header style={{ 
          height: '70px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '0 15px' : '0 30px',
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
            <Link href="/admin/settings" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <div style={{ width: '35px', height: '35px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#0056b3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.9rem', overflow: 'hidden', flexShrink: 0 }}>
                {currentUser.avatar_url ? (
                  <img src={currentUser.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  currentUser.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="hidden-mobile" style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '800', fontSize: '0.8rem', color: '#1e293b', lineHeight: '1' }}>{currentUser.name}</div>
                <div style={{ fontSize: '0.65rem', color: '#16a34a', fontWeight: '800', marginTop: '3px' }}>{currentUser.role}</div>
              </div>
            </Link>
          </div>
        </header>

        {/* Content Wrapper */}
        <div style={{ padding: isMobile ? '20px 15px' : '40px', flex: 1, overflowX: 'hidden' }}>
          {children}
        </div>

        {/* Footer */}
        <footer style={{ padding: isMobile ? '15px' : '20px 40px', borderTop: '1px solid #e2e8f0', backgroundColor: 'white', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: '10px' }}>
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
        @media (max-width: 1024px) {
          .hidden-mobile { display: none !important; }
          .admin-root aside { transform: translateX(0); }
          .admin-root aside[style*="width: 0"] { transform: translateX(-280px); width: 280px !important; }
          .responsive-grid { grid-template-columns: 1fr !important; }
          .responsive-flex { flex-direction: column !important; align-items: flex-start !important; width: 100% !important; }
          
          /* Make all cards and large gaps smaller on mobile */
          div[style*="padding: 40px"], div[style*="padding: 30px"], div[style*="padding: 25px"], div[style*="padding: 20px"],
          div[style*="padding:40px"], div[style*="padding:30px"], div[style*="padding:25px"], div[style*="padding:20px"] {
            padding: 15px !important;
          }
          div[style*="gap: 40px"], div[style*="gap: 30px"], div[style*="gap: 25px"], div[style*="gap: 20px"],
          div[style*="gap:40px"], div[style*="gap:30px"], div[style*="gap:25px"], div[style*="gap:20px"] {
            gap: 12px !important;
          }
          h2[style*="fontSize: 1.8rem"], h2[style*="fontSize: 1.75rem"],
          h2[style*="font-size: 1.8rem"], h2[style*="font-size: 1.75rem"],
          h2[style*="font-size:1.8rem"], h2[style*="font-size:1.75rem"] {
            font-size: 1.4rem !important;
          }
        }
      `}} />
    </div>
  )
}
