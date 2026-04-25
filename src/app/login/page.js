'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ShieldCheck, AlertCircle, ArrowRight, Lock, Mail } from 'lucide-react'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        if (authError.message.toLowerCase().includes('invalid login')) {
          throw new Error('Incorrect email or password. Please check your credentials.')
        }
        throw new Error(authError.message)
      }

      window.location.href = '/admin'

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f4f7f6',
      padding: '20px'
    }}>
      <div className="animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img src="/logo.png" alt="WDO Logo" style={{ height: '80px', width: 'auto', marginBottom: '20px' }} />
          <h1 style={{ color: 'var(--primary-color)', fontSize: '1.75rem', fontWeight: '800' }}>WDO STAFF PORTAL</h1>
          <p style={{ color: '#666', marginTop: '5px' }}>Secure Login for Administrators</p>
        </div>

        <div className="card" style={{ padding: '40px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          {error && (
            <div style={{ 
              backgroundColor: '#fff5f5', color: '#c53030', 
              padding: '12px', borderRadius: '2px', 
              marginBottom: '20px', fontSize: '0.85rem',
              border: '1px solid #feb2b2',
              display: 'flex', gap: '8px'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', display: 'block' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@wdo-somaliland.org"
                  style={{ padding: '12px 12px 12px 40px', border: '1px solid #ddd', width: '100%', borderRadius: '2px' }}
                  required
                />
              </div>
            </div>
            
            <div className="form-group" style={{ marginBottom: '30px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', display: 'block' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ padding: '12px 12px 12px 40px', border: '1px solid #ddd', width: '100%', borderRadius: '2px' }}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '12px', fontWeight: '800', borderRadius: '2px' }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'SIGN IN TO DASHBOARD'}
            </button>
          </form>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Link href="/" style={{ color: '#666', fontSize: '0.85rem', fontWeight: '700' }}>
            &larr; BACK TO PUBLIC WEBSITE
          </Link>
        </div>
      </div>
    </div>
  )
}
