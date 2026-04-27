'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Users, Shield, Key, Search, Plus, 
  MoreVertical, Edit2, Trash2, ShieldCheck,
  CheckCircle2, AlertCircle, X, Loader2
} from 'lucide-react'

export default function UserManagement() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  
  // Modals & Forms State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Editor',
    status: 'Active'
  })

  useEffect(() => {
    fetchUsers()

    // Real-time subscription
    const channel = supabase
      .channel('realtime:profiles')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'profiles' 
      }, () => {
        fetchUsers() // Re-fetch on any change
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Force re-render every 1s for ultra-real-time accuracy
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      // Fetch real users from the profiles table
      const { data, error } = await supabase.from('profiles').select('*')
      
      if (error) {
        console.error('Supabase fetch error:', error)
        setStatus({ type: 'error', text: 'Database error: ' + error.message })
        setUsers([])
      } else {
        setUsers(data || [])
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setStatus(null)

    try {
      if (isEditing) {
        // ACTUAL UPDATE to Supabase
        const { error } = await supabase
          .from('profiles')
          .update({
            name: formData.name,
            role: formData.role,
            status: formData.status
          })
          .eq('id', isEditing)

        if (error) throw error

        setStatus({ type: 'success', text: 'User profile updated successfully!' })
        fetchUsers() // Refresh list
        setIsModalOpen(false)
      } else {
        // Actual Backend API Call for Creation
        const response = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Failed to create user')
        }

        setStatus({ type: 'success', text: 'New user account created successfully!' })
        fetchUsers() // Refresh the list
        setIsModalOpen(false)
      }
    } catch (err) {
      setStatus({ type: 'error', text: err.message || 'Action failed. Please try again.' })
    } finally {
      setSubmitting(false)
      setTimeout(() => setStatus(null), 4000)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to revoke access? This will remove the user profile from the database.')) {
      setLoading(true)
      try {
        const { error } = await supabase.from('profiles').delete().eq('id', id)
        if (error) throw error
        
        setStatus({ type: 'success', text: 'User access revoked successfully.' })
        fetchUsers()
      } catch (err) {
        setStatus({ type: 'error', text: 'Failed to revoke access: ' + err.message })
      }
      setLoading(false)
      setTimeout(() => setStatus(null), 4000)
    }
  }

  const filteredUsers = users.filter(user => {
    const safeName = user.name || ''
    const safeEmail = user.email || ''
    const matchesSearch = safeName.toLowerCase().includes(searchQuery.toLowerCase()) || safeEmail.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Super Admin':
        return <span style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Shield size={12} /> SUPER ADMIN</span>
      case 'Editor':
        return <span style={{ backgroundColor: '#eff6ff', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>EDITOR</span>
      case 'Viewer':
        return <span style={{ backgroundColor: '#f8fafc', color: '#64748b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>VIEWER</span>
      default:
        return <span style={{ backgroundColor: '#f8fafc', color: '#64748b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>{role}</span>
    }
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div className="responsive-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', gap: '15px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Users size={28} color="#0056b3" /> User Roles & Access
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '5px' }}>Manage portal access, assign roles, and secure the system using RBAC.</p>
        </div>
        <button 
          onClick={() => {
            setFormData({ name: '', email: '', password: '', role: 'Editor', status: 'Active' })
            setIsEditing(null)
            setIsModalOpen(true)
          }}
          style={{ padding: '12px 25px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 15px rgba(0,86,179,0.3)' }}
        >
          <Plus size={20} /> ADD NEW USER
        </button>
      </div>

      {status && (
        <div style={{ padding: '15px 20px', borderRadius: '12px', marginBottom: '25px', backgroundColor: status.type === 'success' ? '#ecfdf5' : '#fff1f2', color: status.type === 'success' ? '#059669' : '#e11d48', border: '1px solid ' + (status.type === 'success' ? '#10b981' : '#f43f5e'), display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', fontWeight: '800' }}>
          {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {status.text}
        </div>
      )}

      {/* Analytics Summary */}
      <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '12px', color: '#0056b3' }}><Users size={24} /></div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1e293b' }}>{users.length}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700' }}>TOTAL USERS</div>
          </div>
        </div>
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: '#fef2f2', padding: '12px', borderRadius: '12px', color: '#ef4444' }}><ShieldCheck size={24} /></div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1e293b' }}>{users.filter(u => u.role === 'Super Admin').length}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700' }}>SUPER ADMINS</div>
          </div>
        </div>
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '12px', color: '#10b981' }}><CheckCircle2 size={24} /></div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1e293b' }}>
              {users.filter(u => {
                if (!u.last_login) return false;
                const lastLogin = new Date(u.last_login);
                const now = new Date();
                return (now - lastLogin) / 1000 < 15; // Active in last 15 seconds
              }).length}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700' }}>ONLINE NOW</div>
          </div>
        </div>
      </div>

      {/* Advanced Filter & Search Bar */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative', minWidth: '250px' }}>
          <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '12px 15px 12px 45px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f8fafc', padding: '10px 15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b' }}>FILTER ROLE:</span>
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ background: 'none', border: 'none', outline: 'none', fontSize: '0.9rem', fontWeight: '700', color: '#1e293b', cursor: 'pointer' }}
          >
            <option value="all">All Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Editor">Editor</option>
            <option value="Viewer">Viewer</option>
          </select>
        </div>
      </div>

      {/* RBAC Data Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
        <div style={{ minWidth: '1000px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 80px', padding: '15px 20px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: '800', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>
          <div>User Identity</div>
          <div>Email Contact</div>
          <div>System Role</div>
          <div>Status</div>
          <div>Last Login</div>
          <div style={{ textAlign: 'right' }}>Actions</div>
        </div>

        {loading ? (
          <div style={{ padding: '50px', textAlign: 'center' }}><Loader2 className="animate-spin mx-auto text-primary" size={30} /></div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ padding: '50px', textAlign: 'center', color: '#94a3b8', fontWeight: '600' }}>No users match the selected filters.</div>
        ) : (
          filteredUsers.map((user, index) => (
            <div key={user.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 80px', padding: '15px 20px', borderBottom: index === filteredUsers.length - 1 ? 'none' : '1px solid #f1f5f9', alignItems: 'center', transition: 'background-color 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#0056b3', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.9rem' }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '0.95rem' }}>{user.name}</div>
              </div>
              <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>{user.email}</div>
              <div>{getRoleBadge(user.role)}</div>
              <div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '700', color: user.status === 'Active' ? '#16a34a' : '#94a3b8' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: user.status === 'Active' ? '#16a34a' : '#cbd5e1' }}></div>
                  {user.status}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
                {(() => {
                  if (!user.last_login) return 'Never';
                  const lastLogin = new Date(user.last_login);
                  const now = new Date();
                  const diffSeconds = Math.floor((now - lastLogin) / 1000);
                  const diffMinutes = Math.floor(diffSeconds / 60);
                  
                  if (diffSeconds < 10) {
                    return <span style={{ color: '#16a34a', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a', animation: 'pulse 2s infinite' }}></div> ACTIVE NOW</span>
                  }
                  if (diffSeconds < 60) {
                    return <span style={{ color: '#16a34a', fontWeight: '800' }}>{diffSeconds}s ago</span>
                  }
                  if (diffMinutes < 60) {
                    return <span style={{ color: '#0056b3', fontWeight: '800' }}>{diffMinutes} min ago</span>
                  }
                  return lastLogin.toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
                })()}
              </div>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => {
                    setFormData({ name: user.name, email: user.email, password: '', role: user.role, status: user.status })
                    setIsEditing(user.id)
                    setIsModalOpen(true)
                  }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0056b3' }}
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(user.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: '20px' }}>
          <div className="animate-fade-in" style={{ backgroundColor: 'white', borderRadius: '24px', width: '100%', maxWidth: '600px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
            
            <div style={{ padding: '25px 30px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ backgroundColor: '#0056b3', color: 'white', padding: '10px', borderRadius: '12px' }}>
                  {isEditing ? <Edit2 size={20} /> : <Plus size={20} />}
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#1e293b', margin: 0 }}>
                  {isEditing ? 'Edit User Access' : 'Create New User'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '30px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', display: 'block' }}>FULL NAME</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '12px 15px', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '0.95rem', outline: 'none' }} placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', display: 'block' }}>EMAIL ADDRESS</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '12px 15px', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '0.95rem', outline: 'none' }} placeholder="user@wdo.org" />
                </div>
              </div>

              {!isEditing && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', display: 'block' }}>TEMPORARY PASSWORD</label>
                  <input type="password" required={!isEditing} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} style={{ width: '100%', padding: '12px 15px', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '0.95rem', outline: 'none' }} placeholder="Set a secure password" />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', display: 'block' }}>SYSTEM ROLE</label>
                  <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} style={{ width: '100%', padding: '12px 15px', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '0.95rem', outline: 'none', backgroundColor: '#f8fafc', fontWeight: '700' }}>
                    <option value="Super Admin">Super Admin (Full Access)</option>
                    <option value="Editor">Editor (Content Only)</option>
                    <option value="Viewer">Viewer (Read Only)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', display: 'block' }}>ACCOUNT STATUS</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} style={{ width: '100%', padding: '12px 15px', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '0.95rem', outline: 'none', backgroundColor: '#f8fafc', fontWeight: '700' }}>
                    <option value="Active">Active (Can Login)</option>
                    <option value="Inactive">Inactive (Suspended)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '12px 25px', backgroundColor: 'transparent', color: '#64748b', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}>
                  CANCEL
                </button>
                <button type="submit" disabled={submitting} style={{ padding: '12px 30px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />} 
                  {isEditing ? 'SAVE CHANGES' : 'CREATE ACCOUNT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
