'use client'

import { useState } from 'react'
import { 
  Heart, Rocket, ShieldCheck, Mail, Send, 
  ArrowLeft, CreditCard, Smartphone, Sparkles, 
  Lock, Zap, Star, CheckCircle2
} from 'lucide-react'
import Link from 'next/link'

export default function Donate() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <div className="animate-fade-in" style={{ 
      minHeight: '100vh', 
      background: '#0a0a0b',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Cinematic Background Elements */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(0,86,179,0.15) 0%, transparent 70%)', filter: 'blur(80px)' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(253,184,19,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }}></div>
      
      <div style={{ maxWidth: '1000px', width: '100%', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: 'rgba(255,255,255,0.03)', 
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '10px 20px',
            borderRadius: '99px',
            marginBottom: '30px',
            backdropFilter: 'blur(10px)'
          }}>
            <Sparkles size={16} color="#FDB813" style={{ marginRight: '10px' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: '800', letterSpacing: '2px', color: '#FDB813' }}>WDO DONATION SYSTEM</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 10vw, 4rem)', fontWeight: '900', lineHeight: '1.1', marginBottom: '25px', letterSpacing: '-1.5px' }}>
            Transforming <span style={{ color: '#0056b3' }}>Impact</span><br />
            Is Underway.
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
            We are engineering a premium, high-security donation portal to support our vision. 
            Soon, you'll be able to support WDO programs with ease and security.
          </p>
        </div>

        {/* Integration Preview Cards */}
        <div className="grid-cols-3" style={{ display: 'grid', gap: '20px', marginBottom: '60px' }}>
          {[
            { name: 'MOBILE MONEY', desc: 'Zaad & Sahal Integration', icon: <Smartphone size={24} />, status: '85%' },
            { name: 'INTERNATIONAL', desc: 'Visa & Mastercard Support', icon: <CreditCard size={24} />, status: '90%' },
            { name: 'VIP SECURITY', desc: 'End-to-End Encryption', icon: <Lock size={24} />, status: '100%' }
          ].map((item, i) => (
            <div key={i} style={{ 
              backgroundColor: 'rgba(255,255,255,0.03)', 
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '25px',
              borderRadius: '24px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              cursor: 'default'
            }}>
              <div style={{ color: '#0056b3', marginBottom: '15px', display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: '900', marginBottom: '8px', letterSpacing: '1px' }}>{item.name}</h3>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '15px' }}>{item.desc}</p>
              <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: item.status, height: '100%', backgroundColor: '#0056b3' }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Section */}
        <div style={{ 
          backgroundColor: 'rgba(0,86,179,0.05)', 
          border: '1px solid rgba(0,86,179,0.2)',
          borderRadius: '32px',
          padding: '40px 20px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {!subscribed ? (
            <>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '10px' }}>Stay Informed</h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '30px', fontSize: '0.9rem' }}>Leave your email to be notified the moment we go live.</p>
              
              <form onSubmit={handleSubscribe} className="flex-mobile-stack" style={{ 
                display: 'flex', 
                backgroundColor: 'rgba(255,255,255,0.05)', 
                padding: '6px', 
                borderRadius: '16px', 
                maxWidth: '500px', 
                margin: '0 auto',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ 
                    flex: 1, 
                    background: 'transparent', 
                    border: 'none', 
                    color: 'white', 
                    padding: '12px 20px', 
                    outline: 'none',
                    fontSize: '1rem',
                    minWidth: '0'
                  }}
                />
                <button type="submit" style={{ 
                  backgroundColor: '#0056b3', 
                  color: 'white', 
                  border: 'none', 
                  padding: '12px 25px', 
                  borderRadius: '12px', 
                  fontWeight: '800', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap'
                }}>
                  <Send size={18} /> NOTIFY ME
                </button>
              </form>
            </>
          ) : (
            <div style={{ padding: '20px' }}>
              <div style={{ width: '60px', height: '60px', backgroundColor: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <CheckCircle2 size={30} color="white" />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '10px' }}>You're on the list!</h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>We'll notify you as soon as we go live.</p>
            </div>
          )}
        </div>

        <div className="flex-mobile-stack" style={{ marginTop: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={16} /> BACK TO HOME
          </Link>
          <div className="hidden-mobile" style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} color="#10b981" /> SECURE GATEWAY
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .grid-cols-3 { grid-template-columns: 1fr !important; }
          .flex-mobile-stack { flex-direction: column !important; gap: 20px !important; }
          form.flex-mobile-stack { background: transparent !important; border: none !important; padding: 0 !important; }
          form.flex-mobile-stack input { background: rgba(255,255,255,0.05) !important; border: 1px solid rgba(255,255,255,0.1) !important; border-radius: 12px !important; margin-bottom: 10px !important; width: 100% !important; }
          form.flex-mobile-stack button { width: 100% !important; }
          .hidden-mobile { display: none !important; }
        }
      `}} />
    </div>
  )
}
