'use client'

import React, { useState, useEffect } from 'react'
import { Users, Building, Calendar, MapPin, ArrowRight, Loader2, Globe, Heart, ShieldCheck } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function NetworkAndEvents() {
  const [networkData, setNetworkData] = useState([])
  const [loading, setLoading] = useState(true)

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener('resize', handleResize)

    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from('network_events')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setNetworkData(data || [])
      } catch (err) {
        console.error('Error fetching network data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const networkMembers = networkData.filter(item => item.type === 'met')
  const events = networkData.filter(item => item.type === 'visited')

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#1a1a1a' }}>
      
      {/* 1. HERO SECTION - Fluid & Margins */}
      <section className="hero-network" style={{ 
        padding: isMobile ? '90px 0 40px' : 'clamp(140px, 20vh, 200px) 0 clamp(60px, 10vh, 100px)', 
        backgroundColor: '#002654',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
        <div className="container responsive-container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 'clamp(0.75rem, 2vw, 0.9rem)', fontWeight: '800', letterSpacing: '5px', textTransform: 'uppercase', color: '#ffc107', marginBottom: '15px' }}>
             GLOBAL ENGAGEMENT
          </h1>
          <h2 style={{ 
            fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', 
            fontWeight: '900', 
            marginBottom: '25px', 
            lineHeight: '1.1',
            color: '#ffffff',
            textShadow: '0 4px 15px rgba(0,0,0,0.3)'
          }}>
            Network & <span style={{ color: '#ffc107' }}>Strategic Events</span>
          </h2>
          <p style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', maxWidth: '800px', margin: '0 auto', opacity: 0.9, lineHeight: '1.8', fontWeight: '400', color: '#e2e8f0' }}>
            Building a resilient ecosystem of partners, leaders, and community members to drive sustainable development across Somaliland and beyond.
          </p>
        </div>
      </section>

      {/* 2. EVENTS SECTION - Card Grid */}
      <section style={{ padding: 'clamp(60px, 8vh, 100px) 0', backgroundColor: '#fcfcfc' }}>
        <div className="container responsive-container">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vh, 70px)' }}>
            <h3 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: '900', color: '#002654', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>Events & Impact</h3>
            <p style={{ color: '#64748b', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', fontWeight: '500' }}>Witness our journey through recent field visits and summits.</p>
            <div style={{ width: '40px', height: '4px', backgroundColor: '#16a34a', margin: '20px auto 0' }}></div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(350px, 1fr))', 
            gap: isMobile ? '12px' : '30px',
            justifyContent: 'center'
          }}>
            {events.map(event => (
              <div key={event.id} style={{ 
                backgroundColor: 'white', 
                borderRadius: isMobile ? '12px' : '20px', 
                overflow: 'hidden', 
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease',
                border: '1px solid #f1f5f9'
              }} className="event-card-hover">
                <div style={{ height: isMobile ? '120px' : '220px', overflow: 'hidden' }}>
                  <img src={event.image} alt={event.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: isMobile ? '12px' : '25px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '5px' : '10px', marginBottom: isMobile ? '8px' : '15px', flexWrap: 'wrap' }}>
                    <span style={{ 
                      backgroundColor: '#eff6ff', 
                      color: '#0056b3', 
                      padding: isMobile ? '2px 6px' : '4px 12px', 
                      borderRadius: '4px', 
                      fontSize: isMobile ? '0.65rem' : '0.75rem', 
                      fontWeight: '800' 
                    }}>
                      {event.date}
                    </span>
                    <span style={{ 
                      color: '#94a3b8', 
                      fontSize: isMobile ? '0.65rem' : '0.75rem', 
                      fontWeight: '700', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px' 
                    }}>
                      <MapPin size={isMobile ? 12 : 14} /> {event.location}
                    </span>
                  </div>
                  <h4 style={{ 
                    fontSize: isMobile ? '0.9rem' : '1.25rem', 
                    fontWeight: '900', 
                    color: '#1e293b', 
                    marginBottom: isMobile ? '6px' : '12px', 
                    lineHeight: '1.3',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>{event.name}</h4>
                  <p style={{ 
                    color: '#64748b', 
                    fontSize: isMobile ? '0.75rem' : '0.9rem', 
                    lineHeight: '1.6', 
                    marginBottom: isMobile ? '10px' : '20px', 
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: isMobile ? 2 : 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {event.description}
                  </p>
                  <Link 
                    href={`/network/${event.id}`}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '5px', color: '#002654', 
                      fontWeight: '800', fontSize: isMobile ? '0.65rem' : '0.8rem', textDecoration: 'none',
                      cursor: 'pointer', padding: '0', height: isMobile ? '32px' : '48px', textTransform: 'uppercase', letterSpacing: '0.5px' 
                    }}
                  >
                    READ MORE <ArrowRight size={isMobile ? 12 : 16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. NETWORK SECTION - Member/Partner Grid */}
      <section style={{ padding: 'clamp(60px, 8vh, 100px) 0', backgroundColor: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
        <div className="container responsive-container">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vh, 70px)' }}>
            <h3 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: '900', color: '#002654', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>Global Network</h3>
            <p style={{ color: '#64748b', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', fontWeight: '500' }}>Strategic partnerships and leaders we've collaborated with.</p>
            <div style={{ width: '40px', height: '4px', backgroundColor: '#ffc107', margin: '20px auto 0' }}></div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
            gap: 'clamp(30px, 5vw, 50px) 20px',
            textAlign: 'center'
          }}>
            {loading ? (
              <div style={{ gridColumn: '1 / -1', padding: '50px' }}><Loader2 className="animate-spin mx-auto" /></div>
            ) : networkMembers.map(member => (
              <div key={member.id} className="network-item">
                <div style={{ 
                  width: 'min(160px, 40vw)', height: 'min(160px, 40vw)', borderRadius: '50%', overflow: 'hidden', 
                  margin: '0 auto 20px', boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
                  border: '4px solid white', transition: 'all 0.3s ease'
                }} className="circular-img">
                  <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#1e293b', marginBottom: '5px' }}>{member.name}</h4>
                <p style={{ fontSize: '0.8rem', color: '#0056b3', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>{member.title}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600' }}>
                   <MapPin size={14} /> {member.location}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. JOIN NETWORK CTA */}
      <section style={{ padding: 'clamp(60px, 8vh, 100px) 0', textAlign: 'center' }}>
        <div className="container responsive-container">
          <div style={{ 
            backgroundColor: '#002654', color: 'white', padding: 'clamp(40px, 10vh, 80px) 20px', 
            borderRadius: '24px', position: 'relative', overflow: 'hidden' 
          }}>
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '50%' }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: '900', marginBottom: '20px' }}>Ready to make an impact together?</h3>
              <p style={{ fontSize: 'clamp(0.95rem, 3vw, 1.1rem)', opacity: 0.8, maxWidth: '90%', margin: '0 auto 35px', lineHeight: '1.7' }}>
                Join our growing network of international partners and local experts to bring change to Somaliland.
              </p>
              <a href="/contact" style={{ 
                display: 'inline-flex', alignItems: 'center', gap: '10px', 
                backgroundColor: '#ffc107', color: '#002654', padding: '0 40px', 
                height: '56px', borderRadius: '100px', fontWeight: '900', textDecoration: 'none', 
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)', transition: 'all 0.3s ease'
              }} className="cta-btn">
                JOIN THE NETWORK <Users size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .responsive-container {
          width: 100% !important;
          max-width: 1200px !important;
          margin: 0 auto !important;
          padding-left: 20px !important;
          padding-right: 20px !important;
          box-sizing: border-box !important;
        }
        .network-item:hover .circular-img {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px rgba(0,38,84,0.15) !important;
          border-color: #ffc107 !important;
        }
        .event-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .event-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.08) !important;
        }
        .cta-btn:hover {
          transform: scale(1.05);
          background-color: #ffffff !important;
        }
        @media (max-width: 600px) {
          .responsive-container {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
        }
      `}</style>
    </div>
  )
}
