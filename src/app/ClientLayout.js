'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Search, User, ShoppingCart, Menu, X, Instagram, Facebook, Twitter, 
  ChevronDown, Phone, Mail, MapPin, Globe, ArrowRight, Heart, LogIn, ChevronUp, MessageCircle, Users, HeartPulse
} from 'lucide-react'

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
        { name: 'OUR TEAM', href: '/about/team' },
        { name: 'NETWORK & EVENTS', href: '/network' }
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
        borderBottom: 'none',
        maxHeight: isScrolled ? '0' : '45px',
        overflow: 'hidden',
        transition: 'all 0.4s ease',
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1001
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '25px', height: '100%' }}>
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
        top: isMobile || isScrolled ? '0' : '33px',
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
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              alignItems: 'center',
              maxWidth: isMobile ? '160px' : 'none',
              gap: '2px'
            }}>
              <span style={{ 
                fontSize: isMobile ? '0.7rem' : (isScrolled || pathname !== '/' ? '0.85rem' : '0.95rem'), 
                fontWeight: '900', 
                color: 'white', 
                letterSpacing: '0.5px', 
                lineHeight: '1', 
                whiteSpace: 'nowrap' 
              }}>
                WAQAL DEVELOPMENT
              </span>
              <span style={{ 
                fontSize: isMobile ? '0.7rem' : (isScrolled || pathname !== '/' ? '0.85rem' : '0.95rem'), 
                fontWeight: '900', 
                color: 'white', 
                letterSpacing: '0.5px', 
                lineHeight: '1', 
                whiteSpace: 'nowrap' 
              }}>
                ORGANIZATION
              </span>
            </div>
          </Link>

          <nav className="hidden-mobile" style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginLeft: 'auto', paddingLeft: '40px', marginRight: '15px' }}>
            {navLinks.map((link) => (
              <div key={link.name} className={link.dropdown ? "nav-dropdown-container" : ""} style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
                <Link
                  href={link.dropdown ? '#' : link.href}
                  onClick={(e) => link.dropdown && e.preventDefault()}
                  style={{ color: 'white', fontWeight: '700', fontSize: '0.75rem', textDecoration: 'none', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}
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
              backgroundColor: '#ffc107', color: '#002654', padding: '8px 20px',
              fontWeight: '900', fontSize: '0.75rem', textDecoration: 'none',
              borderRadius: '100px', display: 'block', whiteSpace: 'nowrap'
            }}>
              DONATE
            </Link>
            <button className="show-mobile" onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', padding: '8px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Side Drawer Navigation (Clean Light VIP) */}
      <div
        style={{
          position: 'fixed', top: 0, right: 0, width: '260px', height: '100vh',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(10px)',
          zIndex: 2000, overflowY: 'auto',
          display: 'flex', flexDirection: 'column',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.08)',
          transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          visibility: mounted ? (isMenuOpen ? 'visible' : 'hidden') : 'hidden'
        }}
      >
        {/* Mobile Menu Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/logo.png" alt="WDO Logo" style={{ height: '32px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '900', color: '#002654', letterSpacing: '0.5px', lineHeight: '1' }}>WAQAL DEVELOPMENT</span>
              <span style={{ fontSize: '0.55rem', fontWeight: '800', color: '#64748b', letterSpacing: '1px', lineHeight: '1.4' }}>ORGANIZATION</span>
            </div>
          </div>
          <button onClick={() => setIsMenuOpen(false)} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '50%', width: '32px', height: '32px', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
            <X size={16} />
          </button>
        </div>

        {/* Links */}
        <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {navLinks.map((link, idx) => (
              <div key={link.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Link
                    href={link.dropdown ? '#' : link.href}
                    onClick={(e) => {
                      if (!link.dropdown) setIsMenuOpen(false)
                      else {
                        e.preventDefault();
                        const el = document.getElementById(`mobile-drop-${link.name}`);
                        const icon = document.getElementById(`mobile-icon-${link.name}`);
                        if (el.style.maxHeight === '0px' || !el.style.maxHeight) {
                          el.style.maxHeight = '500px';
                          el.style.opacity = '1';
                          el.style.marginTop = '8px';
                          icon.style.transform = 'rotate(180deg)';
                        } else {
                          el.style.maxHeight = '0px';
                          el.style.opacity = '0';
                          el.style.marginTop = '0px';
                          icon.style.transform = 'rotate(0deg)';
                        }
                      }
                    }}
                    style={{
                      color: (pathname.startsWith(link.href) && link.href !== '/') || pathname === link.href ? '#0056b3' : '#1e293b',
                      backgroundColor: (pathname.startsWith(link.href) && link.href !== '/') || pathname === link.href ? '#eff6ff' : 'transparent',
                      fontWeight: '800', fontSize: '0.85rem', textDecoration: 'none',
                      display: 'flex', alignItems: 'center', gap: '10px', textTransform: 'uppercase', letterSpacing: '0.5px',
                      padding: '10px 12px', borderRadius: '10px', flex: 1, transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ color: (pathname.startsWith(link.href) && link.href !== '/') || pathname === link.href ? '#0056b3' : '#94a3b8' }}>
                      {link.icon && React.cloneElement(link.icon, { size: 16 })}
                    </div>
                    {link.name}
                  </Link>
                  {link.dropdown && (
                    <div id={`mobile-icon-${link.name}`} style={{ transition: 'transform 0.3s', color: '#94a3b8' }}>
                      <ChevronDown size={16} />
                    </div>
                  )}
                </div>

                {link.dropdown && (
                  <div id={`mobile-drop-${link.name}`} style={{ display: 'flex', flexDirection: 'column', gap: '5px', paddingLeft: '35px', maxHeight: '0px', opacity: 0, overflow: 'hidden', transition: 'all 0.3s ease-in-out' }}>
                    {link.dropdown.map(subItem => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        onClick={() => setIsMenuOpen(false)}
                        style={{ color: pathname === subItem.href ? '#0056b3' : '#64748b', fontSize: '0.75rem', fontWeight: '700', textDecoration: 'none', letterSpacing: '0.5px', textTransform: 'uppercase', padding: '6px 0' }}
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

        {/* Mobile Menu Footer */}
        <div style={{ padding: '15px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          <Link
            href="/donate"
            onClick={() => setIsMenuOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              width: '100%', padding: '10px', borderRadius: '10px',
              fontSize: '0.85rem', fontWeight: '800', letterSpacing: '0.5px',
              backgroundColor: '#002654', color: 'white', textDecoration: 'none',
              boxShadow: '0 4px 15px rgba(0,38,84,0.15)',
              marginBottom: '10px'
            }}
          >
            <Heart size={14} fill="white" /> DONATE NOW
          </Link>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && <div onClick={() => setIsMenuOpen(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1999, backdropFilter: 'blur(4px)' }} />}

      <main className="main-content" style={{
        paddingTop: pathname === '/' ? '0' : (isMobile ? '70px' : '90px'),
        minHeight: '80vh'
      }}>
        {children}
      </main>

      {/* Footer */}
      <footer className="footer" style={{ backgroundColor: '#0a192f', color: '#e2e8f0', padding: '60px 0 30px', borderTop: '3px solid #ffc107' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px' }}>
            {/* Column 1: Logo & Mission */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <img src="/logo.png" alt="WDO" style={{ height: '50px', width: 'auto', alignSelf: 'flex-start' }} />
              <p style={{ fontSize: '0.85rem', opacity: 0.7, lineHeight: '1.6', margin: 0 }}>
                Building a sustainable future for Somaliland through education, healthcare, and empowerment.
              </p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '5px' }}>
                <a href="#" style={{ color: '#ffc107' }}><Globe size={18} /></a>
                <a href="#" style={{ color: '#ffc107' }}><Mail size={18} /></a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="hidden-mobile" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h4 style={{ fontWeight: '800', fontSize: '1rem', color: 'white', margin: 0, display: 'block' }}>
                Quick Links
                <div style={{ width: '25px', height: '2px', backgroundColor: '#ffc107', marginTop: '8px' }}></div>
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, margin: 0 }}>
                <li><Link href="/about" className="footer-link">About WDO</Link></li>
                <li><Link href="/programs" className="footer-link">Our Programs</Link></li>
                <li><Link href="/news" className="footer-link">Latest News</Link></li>
                <li><Link href="/contact" className="footer-link">Contact Us</Link></li>
                <li><Link href="/gallery" className="footer-link">Gallery</Link></li>
              </ul>
            </div>

            {/* Column 3: Our Programs */}
            <div className="hidden-mobile" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h4 style={{ fontWeight: '800', fontSize: '1rem', color: 'white', margin: 0, display: 'block' }}>
                Our Programs
                <div style={{ width: '25px', height: '2px', backgroundColor: '#ffc107', marginTop: '8px' }}></div>
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, margin: 0 }}>
                <li><Link href="/programs/education" className="footer-link">Education</Link></li>
                <li><Link href="/programs/health" className="footer-link">Healthcare</Link></li>
                <li><Link href="/programs/environment" className="footer-link">Environment</Link></li>
                <li><Link href="/programs/youth" className="footer-link">Youth Development</Link></li>
              </ul>
            </div>

            {/* Column 4: Contact Info */}
            <div>
              <h4 style={{ fontWeight: '800', fontSize: '1rem', marginBottom: '20px', color: 'white' }}>
                Contact Info
                <div style={{ width: '25px', height: '2px', backgroundColor: '#ffc107', marginTop: '8px' }}></div>
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <MapPin size={16} style={{ color: '#ffc107', marginTop: '2px' }} />
                  <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>Gabiley & Hargeisa, Somaliland</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Mail size={16} style={{ color: '#ffc107' }} />
                  <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>{email}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Phone size={16} style={{ color: '#ffc107' }} />
                  <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>+252 63 3084563</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', opacity: 0.4, margin: 0 }}>
              &copy; {new Date().getFullYear()} Waqal Development Organization.
            </p>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
        .footer-link { color: #e2e8f0; text-decoration: none; font-size: 0.9rem; transition: all 0.3s ease; }
        .footer-link:hover { color: #ffc107; padding-left: 5px; }
        @media (min-width: 769px) { .show-mobile { display: none !important; } }
        @media (max-width: 768px) { 
          .hidden-mobile { display: none !important; } 
          .show-mobile { display: block !important; } 
          .footer { text-align: center !important; padding: 40px 0 20px !important; }
          .footer .container > div { 
            grid-template-columns: 1fr !important; 
            gap: 30px !important; 
          }
          .footer img { margin: 0 auto 20px !important; }
          .footer h4 { margin-bottom: 15px !important; }
        }
      `}} />
    </>
  )
}
