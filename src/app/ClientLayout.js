'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone, Mail, Heart, LogIn, ChevronUp, MessageCircle, ChevronDown, Users, HeartPulse } from 'lucide-react'

export default function ClientLayout({ children }) {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showScrollUp, setShowScrollUp] = useState(false)
  
  const isAdmin = pathname.startsWith('/admin')
  const isLogin = pathname === '/login'

  const phoneNo = '252633084563'
  const email = 'waqaldv@gmail.com'
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollUp(true)
      } else {
        setShowScrollUp(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePhoneClick = (e) => {
    if (window.innerWidth > 768) {
      e.preventDefault()
      window.open(`https://wa.me/${phoneNo}`, '_blank')
    }
  }

  if (isAdmin || isLogin) {
    return <main>{children}</main>
  }

  const navLinks = [
    { name: 'HOME', href: '/', icon: <Menu size={20} /> },
    { 
      name: 'WHO WE ARE', 
      href: '/about',
      icon: <Users size={20} />,
      dropdown: [
        { name: 'MISSION & VISION', href: '/about/mission' },
        { name: 'OUR OBJECTIVES', href: '/about/objectives' },
        { name: 'OUR TEAM', href: '/about/team' }
      ]
    },
    { 
      name: 'OUR PROGRAMS', 
      href: '/programs',
      icon: <HeartPulse size={20} />,
      dropdown: [
        { name: 'IMPROVING EDUCATION', href: '/programs/education' },
        { name: 'IMPROVING HEALTHCARE', href: '/programs/health' },
        { name: 'YOUTH DEVELOPMENT', href: '/programs/youth' },
        { name: 'ENVIRONMENTAL IMPROVEMENT', href: '/programs/environment' }
      ]
    },
    { name: 'BLOG', href: '/news', icon: <MessageCircle size={20} /> },
    { name: 'PHOTO GALLERY', href: '/gallery', icon: <LogIn size={20} /> },
    { name: 'CONTACTS', href: '/contact', icon: <Phone size={20} /> },
  ]

  return (
    <>
      <div style={{ backgroundColor: '#0056b3', color: 'white', padding: '0.4rem 0', fontSize: '0.75rem', fontWeight: '700' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="hidden-mobile" style={{ display: 'flex', gap: '1.5rem' }}>
            <a href={gmailUrl} target="_blank" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Mail size={12} /> {email}
            </a>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
               <a 
                href={`tel:+${phoneNo}`} 
                onClick={handlePhoneClick}
                style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <Phone size={12} /> +252 63 3084563
              </a>
              <a href={`https://wa.me/${phoneNo}`} target="_blank" style={{ color: '#25D366', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <MessageCircle size={14} fill="#25D366" color="#fff" /> WhatsApp
              </a>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', marginLeft: 'auto' }}>
            <Link href="/donate" style={{ color: '#FDB813', display: 'flex', alignItems: 'center', gap: '5px' }}><Heart size={12} fill="#FDB813" /> DONATIONS</Link>
            <Link href="/login" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '5px' }}><LogIn size={12} /> STAFF LOGIN</Link>
          </div>
        </div>
      </div>

      <header className="header" style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: 'white', borderBottom: '1px solid #eee' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
          <Link href="/" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img src="/logo.png" alt="WDO Logo" style={{ height: '50px', width: 'auto' }} />
            <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#0056b3', letterSpacing: '-0.5px' }}>WDO SOMALILAND</span>
          </Link>

          <nav className="hidden-mobile" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {navLinks.map((link) => (
              <div key={link.name} className={link.dropdown ? "nav-dropdown-container" : ""} style={{ position: 'relative', height: '80px', display: 'flex', alignItems: 'center' }}>
                <Link 
                  href={link.dropdown ? '#' : link.href} 
                  onClick={(e) => link.dropdown && e.preventDefault()}
                  style={{ color: (pathname.startsWith(link.href) && link.href !== '/') || pathname === link.href ? '#0056b3' : '#333', fontWeight: '800', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px', cursor: link.dropdown ? 'default' : 'pointer' }}
                >
                  {link.name}
                  {link.dropdown && <ChevronDown size={14} style={{ marginTop: '2px' }} />}
                </Link>
                {link.dropdown && (
                  <div className="nav-dropdown animate-fade-in" style={{ 
                    position: 'absolute', top: '80px', left: 0, backgroundColor: 'white', 
                    minWidth: '220px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
                    borderTop: '3px solid #0056b3', display: 'none', flexDirection: 'column', zIndex: 1000
                  }}>
                    {link.dropdown.map(subItem => (
                      <Link key={subItem.name} href={subItem.href} className="nav-dropdown-item" style={{ padding: '15px 20px', color: '#333', fontSize: '0.85rem', fontWeight: '800', borderBottom: '1px solid #f1f5f9', textDecoration: 'none', transition: 'all 0.2s' }}>
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <button className="show-mobile" onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ background: 'none', border: 'none', color: '#0056b3', cursor: 'pointer', padding: '5px' }}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          <div className="hidden-mobile">
            <Link href="/donate" className="btn btn-secondary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.8rem' }}>
              DONATE NOW
            </Link>
          </div>
        </div>

        {isMenuOpen && (
          <div 
            className="animate-fade-in" 
            style={{ 
              position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', 
              backgroundColor: 'white', zIndex: 2000, overflowY: 'auto',
              display: 'flex', flexDirection: 'column', padding: '0'
            }}
          >
            {/* Mobile Menu Header - Fixed Top */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #f1f5f9', backgroundColor: 'white', position: 'sticky', top: 0, zIndex: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/logo.png" alt="Logo" style={{ height: '35px' }} />
                <span style={{ fontWeight: '900', color: '#0056b3', fontSize: '0.9rem' }}>NAVIGATION MENU</span>
              </div>
              <button onClick={() => setIsMenuOpen(false)} style={{ background: '#0056b3', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,86,179,0.3)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {navLinks.map((link, idx) => (
                  <div 
                    key={link.name} 
                    className="animate-fade-up" 
                    style={{ 
                      animationDelay: `${idx * 50}ms`,
                      borderBottom: '1px solid #f8fafc',
                      paddingBottom: '5px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Link 
                        href={link.dropdown ? '#' : link.href} 
                        onClick={(e) => {
                          if (!link.dropdown) setIsMenuOpen(false)
                          else e.preventDefault()
                        }} 
                        style={{ 
                          color: (pathname.startsWith(link.href) && link.href !== '/') || pathname === link.href ? '#0056b3' : '#334155', 
                          fontWeight: '800', fontSize: '1rem', textDecoration: 'none', padding: '15px 0', flex: 1,
                          display: 'flex', alignItems: 'center', gap: '15px'
                        }}
                      >
                        <div style={{ color: (pathname.startsWith(link.href) && link.href !== '/') || pathname === link.href ? '#0056b3' : '#94a3b8' }}>
                          {link.icon}
                        </div>
                        {link.name}
                      </Link>
                      {link.dropdown && (
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            const el = document.getElementById(`mobile-drop-${link.name}`);
                            if (el) el.style.display = el.style.display === 'none' ? 'flex' : 'none';
                          }}
                          style={{ background: '#f1f5f9', border: 'none', borderRadius: '10px', color: '#64748b', padding: '10px', width: '40px', height: '40px' }}
                        >
                          <ChevronDown size={18} />
                        </button>
                      )}
                    </div>
                    
                    {link.dropdown && (
                      <div id={`mobile-drop-${link.name}`} style={{ display: 'none', flexDirection: 'column', gap: '12px', padding: '15px 0 15px 45px', backgroundColor: '#f8fafc', borderRadius: '12px', marginTop: '5px' }}>
                        {link.dropdown.map(subItem => (
                          <Link 
                            key={subItem.name} 
                            href={subItem.href} 
                            onClick={() => setIsMenuOpen(false)} 
                            style={{ color: pathname === subItem.href ? '#0056b3' : '#64748b', fontSize: '0.9rem', fontWeight: '800', textDecoration: 'none' }}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Menu Footer Actions */}
            <div style={{ marginTop: 'auto', padding: '30px 20px 40px', backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
              <Link 
                href="/donate" 
                onClick={() => setIsMenuOpen(false)} 
                className="btn btn-secondary animate-fade-up" 
                style={{ width: '100%', padding: '18px', borderRadius: '16px', fontSize: '1rem', marginBottom: '15px', boxShadow: '0 8px 20px rgba(40,167,69,0.2)', animationDelay: '300ms' }}
              >
                <Heart size={20} fill="white" style={{ marginRight: '10px' }} /> DONATE TO SUPPORT
              </Link>
              
              <div className="animate-fade-up" style={{ display: 'flex', gap: '12px', animationDelay: '400ms' }}>
                <a href={gmailUrl} target="_blank" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'white', border: '1px solid #e2e8f0', color: '#1e293b', padding: '15px', borderRadius: '16px', textDecoration: 'none', fontWeight: '800', fontSize: '0.85rem' }}>
                  <Mail size={18} /> EMAIL
                </a>
                <a href={`https://wa.me/${phoneNo}`} target="_blank" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#dcfce7', color: '#16a34a', padding: '15px', borderRadius: '16px', textDecoration: 'none', fontWeight: '800', fontSize: '0.85rem' }}>
                  <MessageCircle size={18} fill="#16a34a" color="#dcfce7" /> WHATSAPP
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="main-content">
        {children}
      </main>

      {/* Floating Buttons Stack */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        {/* WhatsApp Floating */}
        <a 
          href={`https://wa.me/${phoneNo}`}
          target="_blank"
          className="animate-fade-in"
          style={{ 
            backgroundColor: '#25D366', 
            color: 'white', 
            width: '48px', 
            height: '48px', 
            borderRadius: '50%', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <MessageCircle size={28} fill="#fff" color="#25D366" />
        </a>

        {/* Scroll Up Floating */}
        {showScrollUp && (
          <button 
            onClick={scrollToTop}
            className="animate-fade-in"
            style={{ 
              backgroundColor: '#0056b3', 
              color: 'white', 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              border: 'none', 
              cursor: 'pointer', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            <ChevronUp size={24} />
          </button>
        )}
      </div>

      {/* Footer */}
      <footer className="footer" style={{ backgroundColor: '#1a1a1a', color: '#ccc', padding: '60px 0 30px' }}>
        <div className="container">
          <div className="grid-cols-3" style={{ display: 'grid', gap: '40px', marginBottom: '40px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <img src="/logo.png" alt="WDO Logo" style={{ height: '40px' }} />
                <h3 style={{ color: 'white', margin: 0 }}>WDO SOMALILAND</h3>
              </div>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.7', textAlign: 'justify' }}>
                Waqal Development Organization (WDO) is an independent, nonprofit, and nongovernmental organization providing project development solutions in the thematic areas of education, healthcare, youth development, and the environment.
              </p>
            </div>
            <div>
              <h4 style={{ color: 'white', marginBottom: '20px' }}>Quick Links</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {navLinks.map(link => (
                  <li key={link.name} style={{ marginBottom: '10px' }}>
                    <Link href={link.href} style={{ color: '#ccc', fontSize: '0.9rem' }}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'white', marginBottom: '20px' }}>Contact</h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '10px' }}>Hargeisa, Somaliland</p>
              <p style={{ fontSize: '0.9rem', marginBottom: '10px' }}>
                Email: <a href={gmailUrl} target="_blank" style={{ color: '#ccc', textDecoration: 'none' }}>{email}</a>
              </p>
              <p style={{ fontSize: '0.9rem', marginBottom: '10px' }}>
                Phone: <a href={`tel:+${phoneNo}`} onClick={handlePhoneClick} style={{ color: '#ccc', textDecoration: 'none' }}>+252 63 3084563</a>
              </p>
              <a href={`https://wa.me/${phoneNo}`} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#25D366', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '700' }}>
                <MessageCircle size={18} fill="#25D366" color="#1a1a1a" /> Chat on WhatsApp
              </a>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #333', paddingTop: '20px', textAlign: 'center', fontSize: '0.8rem' }}>
            &copy; {new Date().getFullYear()} Waqal Development Organization. All rights reserved.
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 769px) { .show-mobile { display: none !important; } }
        @media (max-width: 768px) { .hidden-mobile { display: none !important; } .show-mobile { display: block !important; } }
      `}} />
    </>
  )
}
