'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Lock, ShieldCheck, CheckCircle2, AlertCircle, 
  Eye, EyeOff, Bell, Globe, Moon, Sun, 
  Key, Loader2, Settings as SettingsIcon, Mail,
  Database, Code, Server, HardDriveDownload
} from 'lucide-react'

export default function AdminSettings() {
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [status, setStatus] = useState(null)
  const [activeTab, setActiveTab] = useState('general') // general, security, api, backups
  
  // Security State
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' })

  // General Settings State
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [donationAlerts, setDonationAlerts] = useState(true)
  const [language, setLanguage] = useState('English')
  const [theme, setTheme] = useState('Light')

  useEffect(() => {
    const fetchSettings = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        if (user.user_metadata) {
          setEmailNotifications(user.user_metadata.email_notifications !== false)
          setDonationAlerts(user.user_metadata.donation_alerts !== false)
          setLanguage(user.user_metadata.language || 'English')
          setTheme(user.user_metadata.theme || 'Light')
        }
      }
      setLoading(false)
    }
    fetchSettings()
  }, [])

  const showMessage = (type, text) => {
    setStatus({ type, text })
    setTimeout(() => setStatus(null), 3000)
  }

  const saveSettings = async (updates) => {
    setUpdating(true)
    const { error } = await supabase.auth.updateUser({ data: updates })
    if (error) showMessage('error', error.message)
    else showMessage('success', 'System preferences synchronized successfully!')
    setUpdating(false)
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    if (formData.newPassword !== formData.confirmPassword) {
      showMessage('error', 'Passwords do not match!')
      return
    }
    setUpdating(true)
    const { error } = await supabase.auth.updateUser({ password: formData.newPassword })
    if (error) showMessage('error', error.message)
    else {
      showMessage('success', 'Security credentials updated safely.')
      setFormData({ newPassword: '', confirmPassword: '' })
    }
    setUpdating(false)
  }

  const handleMockAction = (msg) => {
    setUpdating(true)
    setTimeout(() => {
      showMessage('success', msg)
      setUpdating(false)
    }, 1500)
  }

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #0056b3', borderRadius: '50%' }}></div>
      </div>
    )
  }

  const tabs = [
    { id: 'general', label: 'General Site Settings', icon: <Globe size={18} /> },
    { id: 'security', label: 'Security Protocols', icon: <ShieldCheck size={18} /> },
    { id: 'api', label: 'API Integrations', icon: <Code size={18} /> },
    { id: 'backups', label: 'Database Backups', icon: <Database size={18} /> }
  ]

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1e293b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <SettingsIcon size={28} color="#0056b3" /> System Configuration
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>
            Manage core portal settings, integrations, and data security.
          </p>
        </div>
      </div>

      {status && (
        <div className="animate-fade-in" style={{ padding: '15px 25px', borderRadius: '16px', marginBottom: '30px', backgroundColor: status.type === 'success' ? '#f0fdf4' : '#fef2f2', color: status.type === 'success' ? '#166534' : '#991b1b', border: '1px solid ' + (status.type === 'success' ? '#bbf7d0' : '#fecaca'), display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', fontWeight: '800', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          {status.type === 'success' ? <CheckCircle2 size={20} color="#10b981" /> : <AlertCircle size={20} color="#ef4444" />}
          {status.text}
        </div>
      )}

      {/* Modern Horizontal Tabs */}
      <div className="hide-scrollbar" style={{ display: 'flex', gap: '10px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '10px' }}>
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 25px', 
              backgroundColor: activeTab === tab.id ? '#0056b3' : 'white', 
              color: activeTab === tab.id ? 'white' : '#64748b', 
              border: activeTab === tab.id ? '1px solid #0056b3' : '1px solid #e2e8f0', 
              borderRadius: '12px', fontWeight: '800', cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all 0.2s', boxShadow: activeTab === tab.id ? '0 4px 15px rgba(0,86,179,0.2)' : 'none'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div style={{ backgroundColor: 'white', border: '1px solid #f1f5f9', padding: '40px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', minHeight: '400px' }}>
        
        {/* TAB: GENERAL SETTINGS */}
        {activeTab === 'general' && (
          <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#1e293b', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Bell size={20} color="#f59e0b" /> Notification Preferences
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b' }}>System Emails</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>Receive essential portal updates</div>
                    </div>
                    <button onClick={() => { const val = !emailNotifications; setEmailNotifications(val); saveSettings({ email_notifications: val }); }} style={{ width: '50px', height: '28px', backgroundColor: emailNotifications ? '#10b981' : '#cbd5e1', borderRadius: '14px', border: 'none', position: 'relative', cursor: 'pointer', transition: '0.3s' }}>
                        <div style={{ width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '4px', left: emailNotifications ? '26px' : '4px', transition: '0.3s', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}></div>
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b' }}>Critical Alerts</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>Real-time database triggers</div>
                    </div>
                    <button onClick={() => { const val = !donationAlerts; setDonationAlerts(val); saveSettings({ donation_alerts: val }); }} style={{ width: '50px', height: '28px', backgroundColor: donationAlerts ? '#10b981' : '#cbd5e1', borderRadius: '14px', border: 'none', position: 'relative', cursor: 'pointer', transition: '0.3s' }}>
                        <div style={{ width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '4px', left: donationAlerts ? '26px' : '4px', transition: '0.3s', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}></div>
                    </button>
                  </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#1e293b', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Globe size={20} color="#0ea5e9" /> Localization & Display
              </h3>
              <div style={{ marginBottom: '25px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', display: 'block' }}>PORTAL LANGUAGE</label>
                  <select value={language} onChange={(e) => { setLanguage(e.target.value); saveSettings({ language: e.target.value }); }} style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#f8fafc', fontSize: '0.95rem', fontWeight: '700', color: '#1e293b', outline: 'none' }}>
                    <option>English</option>
                    <option>Somali</option>
                    <option>Arabic</option>
                  </select>
              </div>
              <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', display: 'block' }}>THEME APPEARANCE</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <button onClick={() => { setTheme('Light'); saveSettings({ theme: 'Light' }); }} style={{ padding: '12px', borderRadius: '12px', border: '2px solid ' + (theme === 'Light' ? '#0056b3' : '#e2e8f0'), backgroundColor: theme === 'Light' ? '#eff6ff' : 'white', color: theme === 'Light' ? '#0056b3' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '800', transition: 'all 0.2s' }}>
                        <Sun size={18} /> Light Mode
                    </button>
                    <button onClick={() => { setTheme('Dark'); saveSettings({ theme: 'Dark' }); }} style={{ padding: '12px', borderRadius: '12px', border: '2px solid ' + (theme === 'Dark' ? '#0056b3' : '#e2e8f0'), backgroundColor: theme === 'Dark' ? '#1e293b' : 'white', color: theme === 'Dark' ? 'white' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '800', transition: 'all 0.2s' }}>
                        <Moon size={18} /> Dark Mode
                    </button>
                  </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: SECURITY PROTOCOLS */}
        {activeTab === 'security' && (
          <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px' }}>
            <div>
              <div style={{ backgroundColor: '#eff6ff', padding: '25px', borderRadius: '16px', border: '1px solid #bfdbfe' }}>
                <ShieldCheck size={32} color="#0056b3" style={{ marginBottom: '15px' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#1e293b', marginBottom: '10px' }}>Two-Factor Authentication (2FA)</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6', marginBottom: '20px' }}>Add an extra layer of security to your master account by requiring a verification code upon login.</p>
                <button onClick={() => handleMockAction('2FA Setup email sent to your inbox.')} style={{ width: '100%', padding: '12px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}>
                  Enable 2FA
                </button>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#1e293b', marginBottom: '20px' }}>Change Master Password</h3>
              <form onSubmit={handleUpdatePassword}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', display: 'block' }}>NEW PASSWORD</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type={showPassword ? 'text' : 'password'} value={formData.newPassword} onChange={(e) => setFormData({...formData, newPassword: e.target.value})} placeholder="Enter secure password" style={{ width: '100%', padding: '14px 45px', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', backgroundColor: '#f8fafc', fontSize: '0.95rem' }} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', display: 'block' }}>CONFIRM PASSWORD</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type={showPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} placeholder="Repeat new password" style={{ width: '100%', padding: '14px 45px', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', backgroundColor: '#f8fafc', fontSize: '0.95rem' }} required />
                  </div>
                </div>

                <button type="submit" disabled={updating} style={{ padding: '14px 30px', backgroundColor: '#1e293b', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {updating ? <Loader2 size={18} className="animate-spin" /> : <Key size={18} />} 
                  {updating ? 'PROCESSING...' : 'UPDATE CREDENTIALS'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB: API INTEGRATIONS */}
        {activeTab === 'api' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
              <Server size={28} color="#10b981" />
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#1e293b', margin: 0 }}>API & Third-Party Keys</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Manage external integrations like WhatsApp, SendGrid, and Supabase.</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '16px', backgroundColor: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{ fontWeight: '800', color: '#1e293b' }}>Supabase URL</div>
                  <span style={{ fontSize: '0.7rem', backgroundColor: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: '10px', fontWeight: '800' }}>CONNECTED</span>
                </div>
                <input type="text" value="https://xxxxxx.supabase.co" disabled style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: '#e2e8f0', color: '#64748b', fontFamily: 'monospace' }} />
              </div>

              <div style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '16px', backgroundColor: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{ fontWeight: '800', color: '#1e293b' }}>Supabase Anon Key</div>
                  <button style={{ background: 'none', border: 'none', color: '#0056b3', fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer' }}>Reveal</button>
                </div>
                <input type="password" value="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" disabled style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: '#e2e8f0', color: '#64748b', fontFamily: 'monospace' }} />
              </div>
              
              <div style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '16px', backgroundColor: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{ fontWeight: '800', color: '#1e293b' }}>Google Analytics Tag</div>
                  <span style={{ fontSize: '0.7rem', backgroundColor: '#f1f5f9', color: '#64748b', padding: '3px 8px', borderRadius: '10px', fontWeight: '800' }}>INACTIVE</span>
                </div>
                <input type="text" placeholder="G-XXXXXXXXXX" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: 'white', outline: 'none' }} />
              </div>
            </div>
            <div style={{ marginTop: '25px', textAlign: 'right' }}>
              <button onClick={() => handleMockAction('API Keys Saved')} style={{ padding: '12px 25px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}>Save Configurations</button>
            </div>
          </div>
        )}

        {/* TAB: DATABASE BACKUPS */}
        {activeTab === 'backups' && (
          <div className="animate-fade-in" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ width: '80px', height: '80px', backgroundColor: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#0056b3' }}>
              <HardDriveDownload size={40} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1e293b', marginBottom: '10px' }}>Manual Database Backup</h3>
            <p style={{ maxWidth: '500px', margin: '0 auto 30px', color: '#64748b', lineHeight: '1.6' }}>
              Generate a full SQL dump of your current database structure, content, and user data. Backups are automatically generated by Supabase Cloud daily.
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button onClick={() => handleMockAction('Initiating Database Dump...')} style={{ padding: '14px 30px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 15px rgba(0,86,179,0.3)' }}>
                {updating ? <Loader2 size={18} className="animate-spin" /> : <HardDriveDownload size={18} />} 
                GENERATE BACKUP NOW
              </button>
            </div>
            <div style={{ marginTop: '40px', textAlign: 'left', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '15px', color: '#1e293b' }}>Recent Backup Logs</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>Automated Daily Backup</span>
                <span style={{ fontWeight: '700', color: '#16a34a' }}>Completed 6 hrs ago</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>Manual Admin Backup</span>
                <span style={{ fontWeight: '700', color: '#16a34a' }}>Completed 3 days ago</span>
              </div>
            </div>
          </div>
        )}

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  )
}
