'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  User, Mail, Shield, Calendar, 
  Edit2, Save, Lock, Eye, EyeOff, 
  CheckCircle2, AlertCircle, Loader2, Camera
} from 'lucide-react'

export default function AdminProfile() {
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [status, setStatus] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  
  const [userProfile, setUserProfile] = useState({
    id: '',
    name: '',
    email: '',
    role: '',
    status: '',
    created_at: ''
  })

  const [formData, setFormData] = useState({
    name: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profile) {
        setUserProfile(profile)
        setFormData(prev => ({ ...prev, name: profile.name }))
      }
    }
    setLoading(false)
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setUpdating(true)
    setStatus(null)

    const { error } = await supabase
      .from('profiles')
      .update({ name: formData.name })
      .eq('id', userProfile.id)

    if (error) {
      setStatus({ type: 'error', text: 'Failed to update name: ' + error.message })
    } else {
      setStatus({ type: 'success', text: 'Profile name updated successfully!' })
      fetchProfile()
    }
    setUpdating(false)
    setTimeout(() => setStatus(null), 3000)
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    if (formData.newPassword !== formData.confirmPassword) {
      setStatus({ type: 'error', text: 'Passwords do not match!' })
      return
    }

    setUpdating(true)
    const { error } = await supabase.auth.updateUser({
      password: formData.newPassword
    })

    if (error) {
      setStatus({ type: 'error', text: 'Password update failed: ' + error.message })
    } else {
      setStatus({ type: 'success', text: 'Security credentials updated!' })
      setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }))
    }
    setUpdating(false)
    setTimeout(() => setStatus(null), 3000)
  }

  if (loading) {
    return (
      <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={40} color="#0056b3" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Page Title */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1e293b', marginBottom: '8px' }}>My Account Profile</h1>
        <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>Manage your personal information and security settings.</p>
      </div>

      {status && (
        <div className="animate-fade-in" style={{ 
          padding: '15px 25px', borderRadius: '16px', marginBottom: '30px',
          backgroundColor: status.type === 'success' ? '#f0fdf4' : '#fef2f2',
          color: status.type === 'success' ? '#166534' : '#991b1b',
          border: '1px solid ' + (status.type === 'success' ? '#bbf7d0' : '#fecaca'),
          display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', fontWeight: '800'
        }}>
          {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          {status.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px' }}>
        
        {/* Profile Info Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', textAlign: 'center' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 25px' }}>
               <div style={{ width: '100%', height: '100%', backgroundColor: '#0056b3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'white', fontWeight: '900', boxShadow: '0 10px 25px rgba(0,86,179,0.3)' }}>
                 {userProfile.name.charAt(0).toUpperCase()}
               </div>
               <button style={{ position: 'absolute', bottom: '0', right: '0', backgroundColor: 'white', border: '1px solid #e2e8f0', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                 <Camera size={18} />
               </button>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#1e293b', marginBottom: '5px' }}>{userProfile.name}</h2>
            <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '25px' }}>{userProfile.email}</div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
              <span style={{ backgroundColor: '#eff6ff', color: '#0056b3', padding: '6px 15px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={14} /> {userProfile.role.toUpperCase()}
              </span>
              <span style={{ backgroundColor: '#f0fdf4', color: '#16a34a', padding: '6px 15px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>
                {userProfile.status.toUpperCase()}
              </span>
            </div>
            
            <div style={{ marginTop: '30px', paddingTop: '25px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Calendar size={18} color="#94a3b8" />
                  <div style={{ fontSize: '0.85rem' }}>
                    <span style={{ color: '#94a3b8', fontWeight: '600' }}>Member since:</span>
                    <div style={{ color: '#1e293b', fontWeight: '700' }}>{new Date(userProfile.created_at).toLocaleDateString()}</div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Forms Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Edit Personal Info */}
          <div style={{ backgroundColor: 'white', padding: '35px', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#1e293b', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User size={20} color="#0056b3" /> Personal Information
            </h3>
            <form onSubmit={handleUpdateProfile}>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', display: 'block' }}>FULL DISPLAY NAME</label>
                <div style={{ position: 'relative' }}>
                  <Edit2 size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{ width: '100%', padding: '14px 15px 14px 45px', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '0.95rem', outline: 'none', backgroundColor: '#f8fafc' }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '30px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', display: 'block' }}>EMAIL ADDRESS (READ ONLY)</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="email" 
                    value={userProfile.email} 
                    disabled
                    style={{ width: '100%', padding: '14px 15px 14px 45px', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '0.95rem', backgroundColor: '#f1f5f9', color: '#94a3b8' }}
                  />
                </div>
              </div>
              <button type="submit" disabled={updating} style={{ width: '100%', padding: '14px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 15px rgba(0,86,179,0.3)' }}>
                {updating ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
                SAVE PROFILE CHANGES
              </button>
            </form>
          </div>

          {/* Security / Password */}
          <div style={{ backgroundColor: 'white', padding: '35px', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#1e293b', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Lock size={20} color="#f59e0b" /> Change Password
            </h3>
            <form onSubmit={handleUpdatePassword}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', display: 'block' }}>NEW PASSWORD</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                    placeholder="Enter new password"
                    style={{ width: '100%', padding: '14px 45px', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', backgroundColor: '#f8fafc' }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div style={{ marginBottom: '30px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', display: 'block' }}>CONFIRM PASSWORD</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="Repeat new password"
                    style={{ width: '100%', padding: '14px 45px', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', backgroundColor: '#f8fafc' }}
                  />
                </div>
              </div>
              <button type="submit" disabled={updating} style={{ width: '100%', padding: '14px', backgroundColor: '#1e293b', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                {updating ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />} 
                UPDATE PASSWORD
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  )
}
