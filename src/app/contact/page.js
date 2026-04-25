'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Globe } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    const { error } = await supabase
      .from('contacts_messages')
      .insert([formData])

    if (error) {
      setStatus({ type: 'error', text: 'Error sending message. Please try again later.' })
    } else {
      setStatus({ type: 'success', text: 'Your message has been sent successfully! We will contact you soon.' })
      setFormData({ name: '', email: '', subject: '', message: '' })
    }
    setLoading(false)
  }

  return (
    <div className="animate-fade-in">
      {/* Contact Header */}
      <section style={{ padding: '60px 0', backgroundColor: '#f4f7f9', borderBottom: '1px solid #e1e8ed' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, color: '#222', letterSpacing: '-1px' }}>CONTACT US</h1>
        </div>
      </section>

      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="grid-cols-2" style={{ display: 'grid', gap: '60px' }}>
            
            {/* Info Column */}
            <div>
              <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0056b3', marginBottom: '20px' }}>Get In Touch</h2>
                <p style={{ color: '#666', lineHeight: '1.8', fontSize: '1rem' }}>
                  Have questions about our programs or want to partner with us? We'd love to hear from you. Send us a message and our team will get back to you shortly.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ width: '50px', height: '50px', backgroundColor: '#eef6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0056b3', flexShrink: 0 }}>
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', fontWeight: '800' }}>Our Office</h4>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Hargeisa, Somaliland</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ width: '50px', height: '50px', backgroundColor: '#eef6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0056b3', flexShrink: 0 }}>
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', fontWeight: '800' }}>Email Us</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>
                      <a href="https://mail.google.com/mail/?view=cm&fs=1&to=waqaldv@gmail.com" target="_blank" style={{ color: '#0056b3', textDecoration: 'none' }}>waqaldv@gmail.com</a>
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ width: '50px', height: '50px', backgroundColor: '#eef6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0056b3', flexShrink: 0 }}>
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', fontWeight: '800' }}>Call Us</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>
                      <a href="tel:+252633084563" style={{ color: '#0056b3', textDecoration: 'none' }}>+252 63 3084563</a>
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '50px', padding: '30px', backgroundColor: '#0056b3', color: 'white', borderRadius: '4px' }}>
                 <h4 style={{ color: 'white', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}><Clock size={20} /> Working Hours</h4>
                 <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>Saturday - Thursday: 8:00 AM - 4:00 PM</p>
                 <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>Friday: Closed</p>
              </div>
            </div>

            {/* Form Column */}
            <div style={{ backgroundColor: 'white', padding: '40px', border: '1px solid #eee', borderRadius: '4px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '30px' }}>Send a Message</h3>
              
              {status && (
                <div style={{ 
                  padding: '15px', borderRadius: '4px', marginBottom: '25px',
                  backgroundColor: status.type === 'success' ? '#e6f4ea' : '#fff5f5',
                  color: status.type === 'success' ? '#1e7e34' : '#c53030',
                  border: '1px solid ' + (status.type === 'success' ? '#1e7e34' : '#c53030'),
                  fontSize: '0.9rem', fontWeight: '700'
                }}>
                  {status.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '800', marginBottom: '8px', display: 'block' }}>FULL NAME</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{ width: '100%', padding: '12px 15px', border: '1.5px solid #eee', borderRadius: '4px', outline: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '800', marginBottom: '8px', display: 'block' }}>EMAIL ADDRESS</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={{ width: '100%', padding: '12px 15px', border: '1.5px solid #eee', borderRadius: '4px', outline: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '800', marginBottom: '8px', display: 'block' }}>SUBJECT</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Message subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    style={{ width: '100%', padding: '12px 15px', border: '1.5px solid #eee', borderRadius: '4px', outline: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '800', marginBottom: '8px', display: 'block' }}>MESSAGE</label>
                  <textarea 
                    rows="5" 
                    required 
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    style={{ width: '100%', padding: '12px 15px', border: '1.5px solid #eee', borderRadius: '4px', outline: 'none', resize: 'none' }}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  style={{ 
                    width: '100%', padding: '15px', backgroundColor: '#0056b3', color: 'white', 
                    border: 'none', fontWeight: '900', fontSize: '1rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    borderRadius: '4px'
                  }}
                >
                  {loading ? 'SENDING...' : <>SEND MESSAGE <Send size={18} /></>}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
