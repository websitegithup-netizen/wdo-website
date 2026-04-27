'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Users, Mail, Globe, MessageCircle } from 'lucide-react'

export default function TeamClient() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  const defaultMembers = [
    { name: 'Dr. Ahmed Ali', role: 'Executive Director', image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { name: 'Amina Jama', role: 'Head of Programs', image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { name: 'Hassan Omar', role: 'Education Coordinator', image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { name: 'Fatima Yusuf', role: 'Healthcare Lead', image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
  ]

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
    const fetchMembers = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('team')
        .select('*')
        .order('order_index', { ascending: true })
      
      if (!error && data && data.length > 0) {
        setMembers(data)
      } else {
        setMembers(defaultMembers)
      }
      setLoading(false)
    }
    fetchMembers()
  }, [])

  const getEmailLink = (email) => {
    const targetEmail = email || 'waqaldv@gmail.com';
    return isMobile 
      ? `mailto:${targetEmail}` 
      : `https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}`;
  };

  return (
    <div className="animate-fade-in" style={{ backgroundColor: '#ffffff' }}>
      
      {/* Premium Header */}
      <section style={{ 
        backgroundColor: '#ffffff', 
        padding: '30px 0', 
        textAlign: 'center', 
        color: '#002654',
        borderBottom: '1px solid #f1f5f9'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '8px', letterSpacing: '-0.5px' }}>OUR TEAM</h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '700px', margin: '0 auto', lineHeight: '1.4' }}>
            The dedicated professionals and activists driving social impact across Somaliland.
          </p>
        </div>
      </section>

      <section className="section" style={{ padding: '40px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'inline-flex', padding: '10px', backgroundColor: '#eff6ff', borderRadius: '50%', color: '#0056b3', marginBottom: '15px' }}>
              <Users size={24} />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#1e293b', marginBottom: '15px' }}>Our Leadership</h2>
            <p style={{ maxWidth: '700px', margin: '0 auto', color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6' }}>
              WDO was established by a group of multi-disciplinary youth activists committed to social change.
            </p>
          </div>

          <div className="team-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
            gap: '20px' 
          }}>
            {members.map((member) => (
              <div key={member.name} className="hover-scale" style={{ 
                textAlign: 'center', 
                backgroundColor: '#fff', 
                borderRadius: '24px', 
                padding: '25px 20px', 
                border: '1px solid #f1f5f9', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                position: 'relative'
              }}>
                <div style={{ 
                  width: '90px', 
                  height: '90px', 
                  borderRadius: '50%', 
                  overflow: 'hidden', 
                  margin: '0 auto 15px', 
                  border: '3px solid #eff6ff'
                }}>
                  <img 
                    src={member.image_url || member.image} 
                    alt={member.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#1e293b', marginBottom: '5px' }}>{member.name}</h3>
                <p style={{ color: '#0056b3', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '15px' }}>{member.role}</p>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                   <a href={getEmailLink(member.email)} target={isMobile ? "_self" : "_blank"} rel="noopener noreferrer" style={{ color: '#94a3b8' }} title="Gmail"><Mail size={16} /></a>
                   <a href={member.facebook_url || '#'} target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8' }} title="Facebook"><Globe size={16} /></a>
                   <a href={member.whatsapp_no ? `https://wa.me/${member.whatsapp_no.replace(/\D/g,'')}` : '#'} target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8' }} title="WhatsApp"><MessageCircle size={16} /></a>
                </div>
              </div>
            ))}
          </div>
          
          {/* Join Section */}
          <div style={{ 
            marginTop: '50px', 
            padding: '40px 30px', 
            background: 'linear-gradient(135deg, #002654 0%, #0056b3 100%)', 
            color: 'white', 
            borderRadius: '24px', 
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '15px' }}>Join Our Mission</h2>
            <p style={{ maxWidth: '500px', margin: '0 auto 25px', opacity: 0.9, fontSize: '0.95rem', lineHeight: '1.5' }}>
              We are always looking for passionate individuals to join our team.
            </p>
            <a href="/contact" className="hover-scale" style={{ 
              display: 'inline-block', 
              padding: '12px 30px', 
              backgroundColor: 'white', 
              color: '#002654', 
              fontWeight: '900', 
              fontSize: '0.9rem', 
              borderRadius: '100px', 
              textDecoration: 'none'
            }}>
              CONTACT US
            </a>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .hover-scale { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .hover-scale:hover { transform: translateY(-8px) scale(1.02); }
        @media (max-width: 768px) {
          .team-grid { grid-template-columns: repeat(2, 1fr) !important; }
          h1 { font-size: 1.6rem !important; }
        }
        @media (max-width: 480px) {
          .team-grid { grid-template-columns: 1fr !important; }
        }
      `}} />
    </div>
  )
}
