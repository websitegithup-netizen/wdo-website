'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Calendar, MapPin, ArrowLeft, ArrowRight, Loader2, Share2, Globe, Link as LinkIcon, MessageCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function EventDetailClient() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    
    async function fetchEvent() {
      try {
        const { data, error } = await supabase
          .from('network_events')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) throw error
        setEvent(data)
      } catch (err) {
        console.error('Error fetching event:', err)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchEvent()
    }
    return () => window.removeEventListener('resize', handleResize)
  }, [params.id])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 className="animate-spin" size={48} color="#0056b3" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', color: '#002654', marginBottom: '20px' }}>Event Not Found</h2>
        <Link href="/network" style={{ color: '#0056b3', textDecoration: 'none', fontWeight: 'bold' }}>
          Back to Events
        </Link>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: isMobile ? '40px' : '60px' }}>
      {/* HERO HEADER */}
      <div style={{ 
        height: isMobile ? '280px' : '350px', 
        position: 'relative', 
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${event.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end',
        padding: isMobile ? '30px 0' : '40px 0'
      }}>
        <div className="container responsive-container">
          <button 
            onClick={() => router.back()}
            style={{ 
              position: 'absolute', top: isMobile ? '20px' : '30px', left: '15px', 
              backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', 
              color: 'white', padding: '8px 16px', borderRadius: '100px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
              backdropFilter: 'blur(10px)', fontWeight: 'bold', fontSize: '0.8rem'
            }}
          >
            <ArrowLeft size={16} /> Back
          </button>
          
          <div style={{ color: 'white' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <span style={{ backgroundColor: '#ffc107', color: '#002654', padding: '4px 10px', borderRadius: '4px', fontWeight: '800', fontSize: '0.7rem' }}>
                {event.date}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '0.8rem' }}>
                <MapPin size={14} color="#ffc107" /> {event.location}
              </span>
            </div>
            <h1 style={{ 
              fontSize: isMobile ? '1.5rem' : 'clamp(1.8rem, 4vw, 2.8rem)', 
              fontWeight: '900', 
              maxWidth: '850px', 
              lineHeight: '1.2',
              color: '#ffffff',
              textShadow: '0 4px 15px rgba(0,0,0,0.3)',
              margin: 0
            }}>
              {event.name}
            </h1>
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="container responsive-container" style={{ marginTop: isMobile ? '-25px' : '-40px', position: 'relative', zIndex: 10 }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1fr 320px', 
          gap: isMobile ? '20px' : '30px' 
        }}>
          {/* MAIN CONTENT */}
          <div style={{ backgroundColor: 'white', padding: isMobile ? '25px' : '35px', borderRadius: isMobile ? '15px' : '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '40px', height: '4px', backgroundColor: '#16a34a', marginBottom: '20px' }}></div>
            <div style={{ 
              color: '#334155', 
              fontSize: isMobile ? '0.95rem' : '1.05rem', 
              lineHeight: '1.8', 
              whiteSpace: 'pre-line' 
            }}>
              {event.description}
            </div>

            {/* SHARE SECTION */}
            <div style={{ marginTop: '40px', paddingTop: '25px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: '15px' }}>
              <span style={{ fontWeight: '800', color: '#002654', fontSize: '0.85rem' }}>SHARE:</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'white' }} title="Share on Facebook"><Globe size={16} color="#0056b3" /></button>
                <button style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'white' }} title="Share on Twitter"><MessageCircle size={16} color="#1DA1F2" /></button>
                <button style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'white' }} title="Copy Link"><LinkIcon size={16} color="#64748b" /></button>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: '#002654', color: 'white', padding: isMobile ? '25px' : '35px', borderRadius: isMobile ? '15px' : '20px', boxShadow: '0 15px 30px rgba(0,38,84,0.15)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '20px', color: '#ffc107' }}>Event Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Calendar size={20} color="#ffc107" />
                  <div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.6, fontWeight: 'bold' }}>DATE</div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{event.date}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <MapPin size={20} color="#ffc107" />
                  <div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.6, fontWeight: 'bold' }}>LOCATION</div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{event.location}</div>
                  </div>
                </div>
              </div>
              <Link href="/contact" style={{ 
                display: 'block', width: '100%', padding: '12px', backgroundColor: '#ffc107', 
                color: '#002654', textAlign: 'center', borderRadius: '10px', marginTop: '25px',
                textDecoration: 'none', fontWeight: '900', transition: 'transform 0.2s ease', fontSize: '0.9rem'
              }}>
                INQUIRE NOW
              </Link>
            </div>

            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: isMobile ? '15px' : '20px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '15px', color: '#002654' }}>Recent Events</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>Explore our latest impactful summits and community projects across Somaliland.</p>
              <Link href="/network" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '12px', color: '#0056b3', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.85rem' }}>
                View All Events <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
