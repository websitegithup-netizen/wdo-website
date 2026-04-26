'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone, Mail, Heart, LogIn, ChevronUp, MessageCircle, ChevronDown, Users, HeartPulse, Search, Globe } from 'lucide-react'

export default function ClientLayout({ children }) {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showScrollUp, setShowScrollUp] = useState(false)

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  const isAdmin = pathname.startsWith('/admin')
  const isLogin = pathname === '/login'

  const phoneNo = '252633084563'
  const email = 'waqaldv@gmail.com'
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`

  useEffect(() => {
    const handleCheck = () => {
      setIsMobile(window.innerWidth <= 768)
      setIsScrolled(window.scrollY > 20)
    }

    setMounted(true)
    handleCheck()
    window.addEventListener('scroll', handleCheck)
    window.addEventListener('resize', handleCheck)
    return () => {
      window.removeEventListener('scroll', handleCheck)
      window.removeEventListener('resize', handleCheck)
    }
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
      {/* Top Bar - Hidden on Mobile */}
      <div className="hidden-mobile" style={{
        backgroundColor: isScrolled ? '#001a3a' : '#002654',
        color: 'white',
        padding: isScrolled ? '0' : '8px 0',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        maxHeight: isScrolled ? '0' : '50px',
        overflow: 'hidden',
        transition: 'all 0.4s ease',
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1001
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '25px' }}>
          <a href={`tel:+${phoneNo}`} onClick={handlePhoneClick} style={{ color: 'white', fontSize: '0.8rem', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone size={14} fill="#ffc107" color="#ffc107" /> +252 63 3084563
          </a>
          <a href={gmailUrl} target="_blank" style={{ color: 'white', fontSize: '0.8rem', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={14} fill="#ffc107" color="#ffc107" /> waqaldv@gmail.com
          </a>
        </div>
      </div>

      <header className="header" style={{
        position: 'fixed',
        top: isMobile || isScrolled ? '0' : '38px',
        width: '100%',
        zIndex: 1000,
        backgroundColor: !mounted || isMobile || isScrolled || pathname !== '/' ? '#002654' : 'transparent',
        color: 'white',
        boxShadow: isScrolled || isMobile || pathname !== '/' ? '0 4px 15px rgba(0,0,0,0.2)' : 'none',
        transition: 'all 0.4s ease'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: isMobile || isScrolled || pathname !== '/' ? '55px' : '75px', transition: 'all 0.4s ease' }}>
          <Link href="/" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <img
              src="/logo.png"
              alt="WDO Logo"
              style={{
                height: isMobile || isScrolled || pathname !== '/' ? '40px' : '55px',
                transition: 'all 0.4s ease'
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: isMobile || isScrolled || pathname !== '/' ? '1rem' : '1.3rem', fontWeight: '900', color: 'white', letterSpacing: '0.5px', lineHeight: '1' }}>WDO</span>
              <span style={{ fontSize: isMobile || isScrolled || pathname !== '/' ? '1rem' : '1.3rem', fontWeight: '900', color: 'white', letterSpacing: '0.5px', lineHeight: '1.4' }}>SOMALILAND</span>
            </div>
          </Link>

          <nav className="hidden-mobile" style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', marginLeft: 'auto', marginRight: '20px' }}>
            {navLinks.map((link) => (
              <div key={link.name} className={link.dropdown ? "nav-dropdown-container" : ""} style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
                <Link
                  href={link.dropdown ? '#' : link.href}
                  onClick={(e) => link.dropdown && e.preventDefault()}
                  style={{ color: 'white', fontWeight: '700', fontSize: '0.75rem', textDecoration: 'none', letterSpacing: '0.5px' }}
                >
                  {link.name}
                </Link>
                {link.dropdown && (
                  <div className="nav-dropdown animate-fade-in" style={{
                    position: 'absolute', top: '100%', left: 0, backgroundColor: 'white',
                    minWidth: '220px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    borderTop: '4px solid #ffc107', display: 'none', flexDirection: 'column', zIndex: 1000
                  }}>
                    {link.dropdown.map(subItem => (
                      <Link key={subItem.name} href={subItem.href} className="nav-dropdown-item" style={{ padding: '12px 20px', color: '#333', fontSize: '0.8rem', fontWeight: '700', borderBottom: '1px solid #f1f5f9', textDecoration: 'none' }}>
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Link href="/donate" className="hidden-mobile" style={{
              backgroundColor: '#ffc107', color: '#002654', padding: '8px 18px',
              fontWeight: '900', fontSize: '0.8rem', textDecoration: 'none',
              borderRadius: '2px', display: 'block'
            }}>
              DONATE
            </Link>
            <button className="show-mobile" onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '5px' }}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1999,
            backdropFilter: 'blur(4px)',
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      {/* Side Drawer Navigation */}
      <div
        style={{
          position: 'fixed', top: 0, right: 0, width: '280px', height: '100vh',
          backgroundColor: 'white', zIndex: 2000, overflowY: 'auto',
          display: 'flex', flexDirection: 'column', padding: '0',
          boxShadow: '-5px 0 25px rgba(0,0,0,0.1)',
          transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          visibility: mounted ? (isMenuOpen ? 'visible' : 'hidden') : 'hidden'
        }}
      >
        {/* Mobile Menu Header - Fixed Top */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#002654', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1rem', fontWeight: '900', color: 'white', letterSpacing: '0.5px', lineHeight: '1' }}>WDO</span>
              <span style={{ fontSize: '0.8rem', fontWeight: '900', color: 'white', letterSpacing: '0.5px', lineHeight: '1.4' }}>SOMALILAND</span>
            </div>
          </div>
          <button onClick={() => setIsMenuOpen(false)} style={{ background: '#ffc107', border: 'none', borderRadius: '50%', width: '32px', height: '32px', color: '#002654', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '10px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {navLinks.map((link, idx) => (
              <div
                key={link.name}
                style={{
                  borderBottom: '1px solid #f8fafc',
                  paddingBottom: '5px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Link
                    href={link.dropdown ? '#' : link.href}
                    onClick={(e) => {
                      if (!link.dropdown) setIsMenuOpen(false)
                      else {
                        e.preventDefault();
                        const el = document.getElementById(`mobile-drop-${link.name}`);
                        if (el) el.style.display = el.style.display === 'none' ? 'flex' : 'none';
                      }
                    }}
                    style={{
                      color: (pathname.startsWith(link.href) && link.href !== '/') || pathname === link.href ? '#002654' : '#334155',
                      fontWeight: '800', fontSize: '0.9rem', textDecoration: 'none', padding: '12px 0', flex: 1,
                      display: 'flex', alignItems: 'center', gap: '12px'
                    }}
                  >
                    <div style={{ color: (pathname.startsWith(link.href) && link.href !== '/') || pathname === link.href ? '#002654' : '#94a3b8' }}>
                      {link.icon && React.cloneElement(link.icon, { size: 18 })}
                    </div>
                    {link.name}
                  </Link>
                  {link.dropdown && (
                    <ChevronDown size={14} color="#94a3b8" />
                  )}
                </div>

                {link.dropdown && (
                  <div id={`mobile-drop-${link.name}`} style={{ display: 'none', flexDirection: 'column', gap: '10px', padding: '10px 0 10px 40px', backgroundColor: '#f8fafc', borderRadius: '8px', marginBottom: '10px' }}>
                    {link.dropdown.map(subItem => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        onClick={() => setIsMenuOpen(false)}
                        style={{ color: pathname === subItem.href ? '#002654' : '#64748b', fontSize: '0.85rem', fontWeight: '800', textDecoration: 'none' }}
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
        <div style={{ marginTop: 'auto', padding: '20px', backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
          <Link
            href="/donate"
            onClick={() => setIsMenuOpen(false)}
            style={{
              display: 'block', width: '100%', padding: '12px', borderRadius: '8px',
              fontSize: '0.9rem', fontWeight: '900', textAlign: 'center',
              backgroundColor: '#ffc107', color: '#002654', textDecoration: 'none',
              boxShadow: '0 4px 15px rgba(255,193,7,0.3)',
              marginBottom: '10px'
            }}
          >
            DONATE NOW
          </Link>

          <div style={{ display: 'flex', gap: '10px' }}>
            <a href={gmailUrl} target="_blank" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', backgroundColor: 'white', border: '1px solid #e2e8f0', color: '#1e293b', padding: '10px', borderRadius: '12px', textDecoration: 'none', fontWeight: '800', fontSize: '0.65rem' }}>
              <Mail size={14} /> EMAIL
            </a>
            <a href={`https://wa.me/${phoneNo}`} target="_blank" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', backgroundColor: '#dcfce7', color: '#16a34a', padding: '10px', borderRadius: '12px', textDecoration: 'none', fontWeight: '800', fontSize: '0.65rem' }}>
              <MessageCircle size={14} fill="#16a34a" color="#dcfce7" /> WHATSAPP
            </a>
          </div>
        </div>
      </div>

      <main className="main-content" style={{
        paddingTop: pathname === '/' ? '0' : (isMobile ? '55px' : '115px'),
        minHeight: '80vh'
      }}>
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
              backgroundColor: '#002654',
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
      <footer className="footer" style={{ backgroundColor: '#1a1a1a', color: '#ccc', padding: '25px 0 15px' }}>
        <div className="container">
          <div className="grid-cols-3" style={{ display: 'grid', gap: '20px', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <img src="/logo.png" alt="WDO Logo" style={{ height: '25px' }} />
                <h3 style={{ color: 'white', margin: 0, fontSize: '1rem' }}>WDO SOMALILAND</h3>
              </div>
              <p style={{ fontSize: '0.8rem', lineHeight: '1.5', textAlign: 'justify', opacity: 0.8 }}>
                Waqal Development Organization (WDO) provides sustainable solutions in education, health, youth, and environment.
              </p>
            </div>
            <div>
              <h4 style={{ color: 'white', marginBottom: '10px', fontSize: '0.9rem' }}>Quick Links</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                {navLinks.map(link => (
                  <React.Fragment key={link.name}>
                    {link.dropdown ? (
                      link.dropdown.slice(0, 2).map(subItem => (
                        <li key={subItem.name}>
                          <Link href={subItem.href} style={{ color: '#ccc', fontSize: '0.8rem', textDecoration: 'none' }}>{subItem.name}</Link>
                        </li>
                      ))
                    ) : (
                      <li>
                        <Link href={link.href} style={{ color: '#ccc', fontSize: '0.8rem', textDecoration: 'none' }}>{link.name}</Link>
                      </li>
                    )}
                  </React.Fragment>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'white', marginBottom: '10px', fontSize: '0.9rem' }}>Contact</h4>
              <p style={{ fontSize: '0.8rem', marginBottom: '5px' }}>Hargeisa, Somaliland</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <a href={gmailUrl} target="_blank" style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.8rem' }}>{email}</a>
                <a href={`tel:+${phoneNo}`} onClick={handlePhoneClick} style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.8rem' }}>+252 63 3084563</a>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #333', paddingTop: '10px', textAlign: 'center', fontSize: '0.7rem', opacity: 0.6 }}>
            &copy; {new Date().getFullYear()} WDO. All rights reserved.
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
        @media (min-width: 769px) { .show-mobile { display: none !important; } }
        @media (max-width: 768px) { .hidden-mobile { display: none !important; } .show-mobile { display: block !important; } }
      `}} />
    </>
  )
}
