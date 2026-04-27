'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, Shield, Settings, Globe, Code, Database, 
  Camera, Smartphone, MapPin, Clock, Save, Loader2, 
  CheckCircle2, AlertCircle, Phone, FileText, Lock, 
  Key, Mail, Bell, Sun, Moon, Server, HardDriveDownload
} from 'lucide-react'

export default function UnifiedSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [statusMsg, setStatusMsg] = useState(null)
  const [profileStrength, setProfileStrength] = useState(65)
  const [hoverAvatar, setHoverAvatar] = useState(false)
  const [userId, setUserId] = useState(null)
  const fileInputRef = useRef(null)

  // Form Data
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', bio: '', role: 'viewer', avatar_url: null, recent_sessions: []
  })

  // Password Data
  const [passwordData, setPasswordData] = useState({ new: '', confirm: '' })

  // System Settings State
  const [systemData, setSystemData] = useState({
    emailNotifications: true, donationAlerts: true, language: 'English', theme: 'Light'
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUserId(user.id)
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (profile) {
        const fullName = profile.name || profile.full_name || ''
        const nameParts = fullName.split(' ')
        setFormData({
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: user.email || '',
          phone: profile.phone || '',
          bio: profile.bio || '',
          role: profile.role || 'viewer',
          avatar_url: profile.avatar_url,
          recent_sessions: profile.recent_sessions || []
        })
        calculateStrength({ ...profile, email: user.email })
      } else {
        setFormData(prev => ({ ...prev, email: user.email }))
      }

      if (user.user_metadata) {
        setSystemData({
          emailNotifications: user.user_metadata.email_notifications !== false,
          donationAlerts: user.user_metadata.donation_alerts !== false,
          language: user.user_metadata.language || 'English',
          theme: user.user_metadata.theme || 'Light'
        })
      }
    }
    setLoading(false)
  }

  const calculateStrength = (data) => {
    let score = 40
    if(data.name || data.full_name) score += 20
    if(data.phone) score += 20
    if(data.bio) score += 20
    setProfileStrength(score)
  }

  const handleSaveProfile = async (e) => {
    if(e) e.preventDefault()
    if(!userId) return
    setSaving(true)
    
    const fullName = `${formData.firstName} ${formData.lastName}`.trim()
    
    // Update profiles table
    const { error: profileError } = await supabase.from('profiles').update({ 
      name: fullName, phone: formData.phone, bio: formData.bio
    }).eq('id', userId)
    
    // Update auth metadata
    await supabase.auth.updateUser({ data: { name: fullName } })
    
    if (profileError) setStatusMsg({ type: 'error', text: profileError.message })
    else {
      setStatusMsg({ type: 'success', text: 'Profile updated successfully.' })
      calculateStrength(formData)
      window.dispatchEvent(new Event('profileUpdated'))
    }
    
    setSaving(false)
    setTimeout(() => setStatusMsg(null), 3000)
  }

  const handleUpdatePassword = async (e) => {
    if(e) e.preventDefault()
    if (!passwordData.new || passwordData.new !== passwordData.confirm) {
      setStatusMsg({ type: 'error', text: 'Passwords do not match or are empty.' })
      setTimeout(() => setStatusMsg(null), 3000)
      return
    }

    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password: passwordData.new })

    if (error) setStatusMsg({ type: 'error', text: error.message })
    else {
      setStatusMsg({ type: 'success', text: 'Password updated successfully!' })
      setPasswordData({ new: '', confirm: '' })
    }
    setSaving(false)
    setTimeout(() => setStatusMsg(null), 3000)
  }

  const handleSystemSave = async (updates) => {
    setSaving(true)
    const newSystemData = { ...systemData, ...updates }
    setSystemData(newSystemData)
    
    const { error } = await supabase.auth.updateUser({ 
      data: {
        email_notifications: newSystemData.emailNotifications,
        donation_alerts: newSystemData.donationAlerts,
        language: newSystemData.language,
        theme: newSystemData.theme
      }
    })
    
    if (error) setStatusMsg({ type: 'error', text: error.message })
    else setStatusMsg({ type: 'success', text: 'System preferences saved!' })
    
    setSaving(false)
    setTimeout(() => setStatusMsg(null), 3000)
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return

    try {
      setSaving(true)
      setStatusMsg({ type: 'success', text: 'Uploading avatar...' })

      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Math.random()}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName)
      const { error: updateError } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', userId)

      if (updateError) throw updateError

      setFormData({ ...formData, avatar_url: publicUrl })
      setStatusMsg({ type: 'success', text: 'Avatar updated successfully!' })
    } catch (error) {
      setStatusMsg({ type: 'error', text: 'Error uploading avatar: ' + error.message })
    } finally {
      setSaving(false)
      setTimeout(() => setStatusMsg(null), 3000)
    }
  }

  const handleMockAction = (msg) => {
    setSaving(true)
    setTimeout(() => {
      setStatusMsg({ type: 'success', text: msg })
      setSaving(false)
      setTimeout(() => setStatusMsg(null), 3000)
    }, 1500)
  }

  const tabs = [
    { id: 'profile', name: 'Public Profile', icon: <User size={18} /> },
    { id: 'security', name: 'Security & Access', icon: <Shield size={18} /> },
    ...(formData.role === 'admin' || formData.role === 'Super Admin' ? [
      { id: 'system', name: 'System Preferences', icon: <Globe size={18} /> },
      { id: 'api', name: 'Integrations & API', icon: <Code size={18} /> },
      { id: 'backups', name: 'Database Backups', icon: <Database size={18} /> }
    ] : [])
  ]

  const colors = {
    bgApp: '#f8fafc', bgCard: '#ffffff', border: '#f1f5f9', borderDark: '#e2e8f0',
    borderFocus: '#16a34a', textMain: '#0f172a', textMuted: '#64748b', primary: '#16a34a',
  }

  const inputStyles = {
    width: '100%', padding: '12px 16px', borderRadius: '12px', border: `1px solid ${colors.borderDark}`, 
    backgroundColor: '#f8fafc', fontSize: '0.95rem', color: colors.textMain, outline: 'none', transition: 'all 0.2s',
  }

  const labelStyles = {
    display: 'block', fontSize: '0.8rem', fontWeight: '700', color: colors.textMuted, 
    marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px'
  }

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '30px', padding: '20px' }}>
        <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '48px', borderRadius: '12px', background: '#e2e8f0' }}></div>)}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="skeleton" style={{ height: '200px', borderRadius: '16px', background: '#e2e8f0' }}></div>
          <div className="skeleton" style={{ height: '400px', borderRadius: '16px', background: '#e2e8f0' }}></div>
        </div>
      </div>
    )
  }

  return (
    <div className="responsive-flex" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '30px', alignItems: 'flex-start', paddingBottom: '100px' }}>
      
      {/* LEFT SIDEBAR NAVIGATION */}
      <div style={{ 
        width: '100%', maxWidth: '280px', backgroundColor: colors.bgCard, borderRadius: '16px', 
        padding: '24px 16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: `1px solid ${colors.border}`,
        position: 'sticky', top: '90px', flexShrink: 0
      }}>
        <div style={{ padding: '0 10px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: colors.textMain, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Settings size={24} color={colors.primary} /> Settings
          </h2>
          <p style={{ fontSize: '0.85rem', color: colors.textMuted, marginTop: '4px' }}>Manage profile and system configurations</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px',
                borderRadius: '12px', border: 'none', cursor: 'pointer',
                backgroundColor: activeTab === tab.id ? '#f0fdf4' : 'transparent',
                color: activeTab === tab.id ? colors.primary : colors.textMuted,
                fontWeight: activeTab === tab.id ? '800' : '600',
                fontSize: '0.95rem', textAlign: 'left', transition: 'all 0.2s', position: 'relative'
              }}
              onMouseEnter={(e) => { if(activeTab !== tab.id) e.currentTarget.style.backgroundColor = '#f8fafc' }}
              onMouseLeave={(e) => { if(activeTab !== tab.id) e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              {tab.icon}
              {tab.name}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeNav"
                  style={{ position: 'absolute', left: 0, top: '15%', bottom: '15%', width: '4px', backgroundColor: colors.primary, borderRadius: '0 4px 4px 0' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <AnimatePresence mode="wait">
          {statusMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              style={{ padding: '16px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700', fontSize: '0.9rem', backgroundColor: statusMsg.type === 'success' ? '#f0fdf4' : '#fef2f2', color: statusMsg.type === 'success' ? '#166534' : '#991b1b', border: `1px solid ${statusMsg.type === 'success' ? '#bbf7d0' : '#fecaca'}` }}
            >
              {statusMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {statusMsg.text}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* PUBLIC PROFILE TAB */}
            {activeTab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="responsive-flex" style={{ backgroundColor: colors.bgCard, borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', gap: '30px' }}>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    onMouseEnter={() => setHoverAvatar(true)}
                    onMouseLeave={() => setHoverAvatar(false)}
                    style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#eff6ff', border: '3px solid white', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', cursor: 'pointer', overflow: 'hidden', flexShrink: 0 }}
                  >
                    {formData.avatar_url ? (
                      <img src={formData.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: '900', color: '#3b82f6' }}>
                        {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                      </div>
                    )}
                    <AnimatePresence>
                      {hoverAvatar && (
                        <motion.div 
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}
                        >
                          <Camera size={28} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" style={{ display: 'none' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: colors.textMain, margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>
                      {formData.firstName} {formData.lastName}
                    </h1>
                    <p style={{ fontSize: '1rem', color: colors.textMuted, fontWeight: '600', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {formData.role.toUpperCase()} <span style={{ color: '#cbd5e1' }}>•</span> WDO Workspace
                    </p>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '700' }}>
                        <span style={{ color: colors.textMuted }}>Profile Strength</span>
                        <span style={{ color: profileStrength === 100 ? colors.primary : '#f59e0b' }}>{profileStrength}%</span>
                      </div>
                      <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                        <motion.div 
                          initial={{ width: 0 }} animate={{ width: `${profileStrength}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
                          style={{ height: '100%', backgroundColor: profileStrength === 100 ? colors.primary : '#f59e0b', borderRadius: '4px' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: colors.bgCard, borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: `1px solid ${colors.border}` }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: colors.textMain, marginBottom: '24px' }}>Personal Information</h3>
                  <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div>
                      <label style={labelStyles}>First Name</label>
                      <input type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} style={inputStyles} onFocus={(e) => { e.target.style.borderColor = colors.borderFocus; e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)' }} onBlur={(e) => { e.target.style.borderColor = colors.borderDark; e.target.style.boxShadow = 'none' }} />
                    </div>
                    <div>
                      <label style={labelStyles}>Last Name</label>
                      <input type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} style={inputStyles} onFocus={(e) => { e.target.style.borderColor = colors.borderFocus; e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)' }} onBlur={(e) => { e.target.style.borderColor = colors.borderDark; e.target.style.boxShadow = 'none' }} />
                    </div>
                    <div>
                      <label style={labelStyles}>Email Address (Read Only)</label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input type="email" value={formData.email} disabled style={{ ...inputStyles, paddingLeft: '42px', backgroundColor: '#f1f5f9', color: '#94a3b8', cursor: 'not-allowed' }} />
                      </div>
                    </div>
                    <div>
                      <label style={labelStyles}>Phone Number</label>
                      <div style={{ position: 'relative' }}>
                        <Phone size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={{ ...inputStyles, paddingLeft: '42px' }} onFocus={(e) => { e.target.style.borderColor = colors.borderFocus; e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)' }} onBlur={(e) => { e.target.style.borderColor = colors.borderDark; e.target.style.boxShadow = 'none' }} />
                      </div>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyles}>Biography</label>
                      <div style={{ position: 'relative' }}>
                        <FileText size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: '#94a3b8' }} />
                        <textarea rows="4" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} style={{ ...inputStyles, paddingLeft: '42px', resize: 'none' }} onFocus={(e) => { e.target.style.borderColor = colors.borderFocus; e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)' }} onBlur={(e) => { e.target.style.borderColor = colors.borderDark; e.target.style.boxShadow = 'none' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="responsive-flex" style={{ backgroundColor: colors.bgCard, borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ width: '56px', height: '56px', backgroundColor: '#f0fdf4', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.primary }}>
                      <Shield size={28} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: colors.textMain, margin: '0 0 4px 0' }}>Two-Factor Authentication</h3>
                      <p style={{ fontSize: '0.9rem', color: colors.textMuted, margin: 0 }}>Add an extra layer of security to your account.</p>
                    </div>
                  </div>
                  <button onClick={() => handleMockAction('2FA Setup Instructions Sent')} style={{ padding: '10px 24px', backgroundColor: 'transparent', border: `1px solid ${colors.borderDark}`, borderRadius: '12px', fontWeight: '700', color: colors.textMain, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.target.style.backgroundColor='#f8fafc'} onMouseLeave={e => e.target.style.backgroundColor='transparent'}>
                    Enable 2FA
                  </button>
                </div>

                <div style={{ backgroundColor: colors.bgCard, borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: `1px solid ${colors.border}` }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: colors.textMain, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Key size={20} /> Update Password
                  </h3>
                  <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div>
                      <label style={labelStyles}>New Password</label>
                      <input type="password" placeholder="••••••••" value={passwordData.new} onChange={e => setPasswordData({...passwordData, new: e.target.value})} style={inputStyles} onFocus={(e) => { e.target.style.borderColor = colors.borderFocus; e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)' }} onBlur={(e) => { e.target.style.borderColor = colors.borderDark; e.target.style.boxShadow = 'none' }} />
                    </div>
                    <div>
                      <label style={labelStyles}>Confirm Password</label>
                      <input type="password" placeholder="••••••••" value={passwordData.confirm} onChange={e => setPasswordData({...passwordData, confirm: e.target.value})} style={inputStyles} onFocus={(e) => { e.target.style.borderColor = colors.borderFocus; e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)' }} onBlur={(e) => { e.target.style.borderColor = colors.borderDark; e.target.style.boxShadow = 'none' }} />
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: colors.bgCard, borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: `1px solid ${colors.border}` }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: colors.textMain, marginBottom: '24px' }}>Recent Login Sessions</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {formData.recent_sessions && formData.recent_sessions.length > 0 ? formData.recent_sessions.map((session, idx) => {
                      // Determine time string
                      const sessionTime = new Date(session.time)
                      const isNow = (new Date() - sessionTime) < 60000 // less than 1 minute ago
                      const timeStr = isNow ? 'Active Now' : sessionTime.toLocaleString()
                      
                      return (
                        <div key={idx} className="responsive-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: `1px solid ${colors.borderDark}`, borderRadius: '12px', backgroundColor: '#fcfcfc', gap: '10px' }}>
                          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <div style={{ color: colors.textMuted }}>
                              {session.device.includes('Mac') || session.device.includes('Windows') ? <Globe size={20} /> : <Smartphone size={20} />}
                            </div>
                            <div>
                              <div style={{ fontWeight: '800', fontSize: '0.95rem', color: colors.textMain }}>{session.device}</div>
                              <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: colors.textMuted, marginTop: '4px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {session.location}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {timeStr}</span>
                              </div>
                            </div>
                          </div>
                          {idx === 0 && (
                            <div style={{ backgroundColor: '#f0fdf4', color: colors.primary, padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>Current</div>
                          )}
                        </div>
                      )
                    }) : (
                      <p style={{ color: colors.textMuted, fontSize: '0.9rem' }}>No recent sessions recorded yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SYSTEM SETTINGS TAB */}
            {activeTab === 'system' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ backgroundColor: colors.bgCard, borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: `1px solid ${colors.border}` }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: colors.textMain, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Bell size={20} color="#f59e0b" /> Notification Preferences
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="responsive-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', border: `1px solid ${colors.borderDark}`, gap: '15px' }}>
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: '800', color: colors.textMain }}>System Emails</div>
                        <div style={{ fontSize: '0.85rem', color: colors.textMuted, marginTop: '4px' }}>Receive essential portal updates and administrative notices</div>
                      </div>
                      <button onClick={() => handleSystemSave({ emailNotifications: !systemData.emailNotifications })} style={{ width: '56px', height: '32px', backgroundColor: systemData.emailNotifications ? colors.primary : '#cbd5e1', borderRadius: '16px', border: 'none', position: 'relative', cursor: 'pointer', transition: '0.3s' }}>
                        <div style={{ width: '24px', height: '24px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '4px', left: systemData.emailNotifications ? '28px' : '4px', transition: '0.3s', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}></div>
                      </button>
                    </div>
                    <div className="responsive-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', border: `1px solid ${colors.borderDark}`, gap: '15px' }}>
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: '800', color: colors.textMain }}>Critical Alerts</div>
                        <div style={{ fontSize: '0.85rem', color: colors.textMuted, marginTop: '4px' }}>Real-time database triggers and security events</div>
                      </div>
                      <button onClick={() => handleSystemSave({ donationAlerts: !systemData.donationAlerts })} style={{ width: '56px', height: '32px', backgroundColor: systemData.donationAlerts ? colors.primary : '#cbd5e1', borderRadius: '16px', border: 'none', position: 'relative', cursor: 'pointer', transition: '0.3s' }}>
                        <div style={{ width: '24px', height: '24px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '4px', left: systemData.donationAlerts ? '28px' : '4px', transition: '0.3s', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}></div>
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: colors.bgCard, borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: `1px solid ${colors.border}` }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: colors.textMain, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Globe size={20} color="#0ea5e9" /> Localization & Display
                  </h3>
                  <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div>
                      <label style={labelStyles}>PORTAL LANGUAGE</label>
                      <select value={systemData.language} onChange={(e) => handleSystemSave({ language: e.target.value })} style={{ width: '100%', padding: '14px', border: `1px solid ${colors.borderDark}`, borderRadius: '12px', backgroundColor: '#f8fafc', fontSize: '0.95rem', fontWeight: '700', color: colors.textMain, outline: 'none' }}>
                        <option>English</option>
                        <option>Somali</option>
                        <option>Arabic</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyles}>THEME APPEARANCE</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <button onClick={() => handleSystemSave({ theme: 'Light' })} style={{ padding: '12px', borderRadius: '12px', border: '2px solid ' + (systemData.theme === 'Light' ? colors.primary : colors.borderDark), backgroundColor: systemData.theme === 'Light' ? '#f0fdf4' : 'white', color: systemData.theme === 'Light' ? colors.primary : colors.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '800', transition: 'all 0.2s' }}>
                          <Sun size={18} /> Light
                        </button>
                        <button onClick={() => handleSystemSave({ theme: 'Dark' })} style={{ padding: '12px', borderRadius: '12px', border: '2px solid ' + (systemData.theme === 'Dark' ? colors.primary : colors.borderDark), backgroundColor: systemData.theme === 'Dark' ? '#1e293b' : 'white', color: systemData.theme === 'Dark' ? 'white' : colors.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '800', transition: 'all 0.2s' }}>
                          <Moon size={18} /> Dark
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* API TAB */}
            {activeTab === 'api' && (
              <div style={{ backgroundColor: colors.bgCard, borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: `1px solid ${colors.border}` }}>
                <div className="responsive-flex" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '32px' }}>
                  <div style={{ width: '56px', height: '56px', backgroundColor: '#eff6ff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                    <Server size={28} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: colors.textMain, margin: 0 }}>API & Integrations</h3>
                    <p style={{ fontSize: '0.9rem', color: colors.textMuted, margin: 0 }}>Manage external connections and third-party keys.</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                  <div style={{ padding: '24px', border: `1px solid ${colors.borderDark}`, borderRadius: '16px', backgroundColor: '#f8fafc' }}>
                    <div className="responsive-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', gap: '10px' }}>
                      <div style={{ fontWeight: '800', color: colors.textMain, fontSize: '1.05rem' }}>Supabase URL</div>
                      <span style={{ fontSize: '0.75rem', backgroundColor: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '12px', fontWeight: '800', whiteSpace: 'nowrap' }}>CONNECTED</span>
                    </div>
                    <input type="text" value="https://xxxxxx.supabase.co" disabled style={{ width: '100%', padding: '14px', border: `1px solid ${colors.borderDark}`, borderRadius: '10px', backgroundColor: '#e2e8f0', color: colors.textMuted, fontFamily: 'monospace' }} />
                  </div>
                  <div style={{ padding: '24px', border: `1px solid ${colors.borderDark}`, borderRadius: '16px', backgroundColor: '#f8fafc' }}>
                    <div className="responsive-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', gap: '10px' }}>
                      <div style={{ fontWeight: '800', color: colors.textMain, fontSize: '1.05rem' }}>Google Analytics Tag</div>
                      <span style={{ fontSize: '0.75rem', backgroundColor: '#f1f5f9', color: colors.textMuted, padding: '4px 10px', borderRadius: '12px', fontWeight: '800', whiteSpace: 'nowrap' }}>INACTIVE</span>
                    </div>
                    <input type="text" placeholder="G-XXXXXXXXXX" style={{ width: '100%', padding: '14px', border: `1px solid ${colors.borderDark}`, borderRadius: '10px', backgroundColor: 'white', outline: 'none' }} />
                  </div>
                </div>
              </div>
            )}

            {/* BACKUPS TAB */}
            {activeTab === 'backups' && (
              <div style={{ backgroundColor: colors.bgCard, borderRadius: '16px', padding: '60px 40px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: `1px solid ${colors.border}`, textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', backgroundColor: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#3b82f6' }}>
                  <HardDriveDownload size={40} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: colors.textMain, marginBottom: '10px' }}>Manual Database Backup</h3>
                <p style={{ maxWidth: '500px', margin: '0 auto 30px', color: colors.textMuted, lineHeight: '1.6' }}>
                  Generate a full SQL dump of your current database structure, content, and user data. Backups are automatically generated by Supabase Cloud daily.
                </p>
                <button onClick={() => handleMockAction('Initiating Database Dump...')} style={{ padding: '14px 30px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '30px', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 15px rgba(59,130,246,0.3)', transition: 'transform 0.2s' }} onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.target.style.transform = 'translateY(0)'}>
                  <HardDriveDownload size={18} /> GENERATE BACKUP NOW
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

      </div>

      {/* FIXED SAVE BUTTON (Only show for Profile and Security as others auto-save or don't need it) */}
      {(activeTab === 'profile' || activeTab === 'security') && (
        <motion.div 
          initial={{ y: 100 }} animate={{ y: 0 }}
          style={{ position: 'fixed', bottom: '40px', right: '40px', zIndex: 50 }}
        >
          <button 
            onClick={activeTab === 'security' ? handleUpdatePassword : handleSaveProfile}
            disabled={saving}
            style={{ 
              backgroundColor: colors.textMain, color: 'white', padding: '16px 32px',
              borderRadius: '30px', fontWeight: '900', fontSize: '1rem', border: 'none',
              display: 'flex', alignItems: 'center', gap: '12px', cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: '0 10px 25px rgba(15,23,42,0.3)', transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => { if(!saving) e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={(e) => { if(!saving) e.currentTarget.style.transform = 'translateY(0)' }}
          >
            {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {activeTab === 'security' ? 'Update Password' : 'Save Profile'}
          </button>
        </motion.div>
      )}

    </div>
  )
}
