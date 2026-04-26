'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Plus, Edit2, Trash2, X, Save, 
  Image as ImageIcon, Loader2,
  CheckCircle2, AlertCircle, Search,
  User, Briefcase, Hash, Globe, MessageCircle, Mail
} from 'lucide-react'

export default function TeamManagement() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    image_url: '',
    order_index: 0,
    facebook_url: '',
    whatsapp_no: '',
    email: ''
  })

  const [userRole, setUserRole] = useState('Viewer')

  useEffect(() => {
    fetchMembers()
    checkRole()
  }, [])

  const checkRole = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      if (profile) setUserRole(profile.role)
    }
  }

  const fetchMembers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('team')
      .select('*')
      .order('order_index', { ascending: true })
    
    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('relation "team" does not exist')) {
        setStatus({ type: 'error', text: 'Database Error: Table "team" not found. Please create it in Supabase dashboard with columns: name, role, image_url, order_index, facebook_url, whatsapp_no, email.' })
      } else {
        setStatus({ type: 'error', text: error.message })
      }
    } else {
      setMembers(data || [])
    }
    setLoading(false)
  }

  const handleImageUpload = async (e) => {
    try {
      setUploading(true)
      const file = e.target.files[0]
      if (!file) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `team/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('wdo-assets')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('wdo-assets')
        .getPublicUrl(filePath)

      setFormData({ ...formData, image_url: publicUrl })
      setStatus({ type: 'success', text: 'Profile picture uploaded!' })
    } catch (error) {
      setStatus({ type: 'error', text: 'Upload failed. Check storage bucket.' })
    } finally {
      setUploading(false)
      setTimeout(() => setStatus(null), 3000)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    if (isEditing) {
      const { error } = await supabase.from('team').update(formData).eq('id', isEditing)
      if (error) {
        setStatus({ type: 'error', text: `Failed: ${error.message}` })
      } else {
        setStatus({ type: 'success', text: 'Member updated!' })
        setIsModalOpen(false)
        fetchMembers()
      }
    } else {
      const { error } = await supabase.from('team').insert([formData])
      if (error) {
        setStatus({ type: 'error', text: `Failed: ${error.message}` })
      } else {
        setStatus({ type: 'success', text: 'Member added to team!' })
        setIsModalOpen(false)
        fetchMembers()
      }
    }
    setLoading(false)
    setTimeout(() => setStatus(null), 3000)
  }

  const handleDelete = async (id) => {
    if (confirm('Remove this member from the team?')) {
      const { error } = await supabase.from('team').delete().eq('id', id)
      if (!error) fetchMembers()
    }
  }

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1e293b', margin: 0 }}>Team Management</h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '5px' }}>Manage organizational leadership and staff members.</p>
        </div>
        {(userRole === 'Super Admin' || userRole === 'Editor') && (
          <button 
            onClick={() => {
              setFormData({ name: '', role: '', image_url: '', order_index: members.length, facebook_url: '', whatsapp_no: '', email: '' })
              setIsEditing(null)
              setIsModalOpen(true)
            }}
            style={{ padding: '12px 25px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 15px rgba(0,86,179,0.3)' }}
          >
            <Plus size={20} /> ADD MEMBER
          </button>
        )}
      </div>

      {status && (
        <div style={{ padding: '15px 20px', borderRadius: '12px', marginBottom: '25px', backgroundColor: status.type === 'success' ? '#ecfdf5' : '#fff1f2', color: status.type === 'success' ? '#059669' : '#e11d48', border: '1px solid ' + (status.type === 'success' ? '#10b981' : '#f43f5e'), display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', fontWeight: '800' }}>
          {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {status.text}
        </div>
      )}

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Search members by name or role..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '12px 15px 12px 45px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
        {loading ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px' }}><Loader2 className="animate-spin mx-auto text-primary" size={30} /></div>
        ) : filteredMembers.length === 0 ? (
          <div style={{ gridColumn: '1/-1', padding: '50px', textAlign: 'center', color: '#94a3b8', fontWeight: '600' }}>No team members found.</div>
        ) : (
          filteredMembers.map(member => (
            <div key={member.id} style={{ backgroundColor: 'white', borderRadius: '24px', padding: '25px', border: '1px solid #e2e8f0', textAlign: 'center', position: 'relative', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '8px' }}>
                <button onClick={() => { setFormData({
                  name: member.name,
                  role: member.role,
                  image_url: member.image_url,
                  order_index: member.order_index,
                  facebook_url: member.facebook_url || '',
                  whatsapp_no: member.whatsapp_no || '',
                  email: member.email || ''
                }); setIsEditing(member.id); setIsModalOpen(true); }} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '10px', color: '#0056b3', cursor: 'pointer' }}><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(member.id)} style={{ background: '#fff1f2', border: '1px solid #fee2e2', padding: '8px', borderRadius: '10px', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
              </div>
              
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 15px', backgroundColor: '#f8fafc', border: '3px solid #f1f5f9' }}>
                {member.image_url ? (
                  <img src={member.image_url} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}><User size={40} /></div>
                )}
              </div>
              
              <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#1e293b', marginBottom: '5px' }}>{member.name}</h3>
              <p style={{ color: '#0056b3', fontWeight: '700', fontSize: '0.9rem', marginBottom: '10px' }}>{member.role}</p>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Order: {member.order_index}</div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: '20px' }}>
          <div className="animate-fade-in" style={{ backgroundColor: 'white', borderRadius: '20px', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 25px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#1e293b', margin: 0 }}>{isEditing ? 'Edit Member' : 'Add Team Member'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '20px', maxHeight: '80vh', overflowY: 'auto' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '6px', display: 'block' }}>FULL NAME</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '10px 12px 10px 38px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', backgroundColor: '#f8fafc' }} placeholder="e.g. Dr. Ahmed Ali" />
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '6px', display: 'block' }}>ROLE / POSITION</label>
                <div style={{ position: 'relative' }}>
                  <Briefcase size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input type="text" required value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} style={{ width: '100%', padding: '10px 12px 10px 38px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', backgroundColor: '#f8fafc' }} placeholder="e.g. Executive Director" />
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '6px', display: 'block' }}>DISPLAY ORDER</label>
                <div style={{ position: 'relative' }}>
                  <Hash size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input type="number" required value={formData.order_index} onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value)})} style={{ width: '100%', padding: '10px 12px 10px 38px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', backgroundColor: '#f8fafc' }} />
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '6px', display: 'block' }}>FACEBOOK URL</label>
                <div style={{ position: 'relative' }}>
                  <Globe size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input type="url" value={formData.facebook_url} onChange={(e) => setFormData({...formData, facebook_url: e.target.value})} style={{ width: '100%', padding: '10px 12px 10px 38px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', backgroundColor: '#f8fafc' }} placeholder="https://facebook.com/..." />
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '6px', display: 'block' }}>WHATSAPP NUMBER</label>
                <div style={{ position: 'relative' }}>
                  <MessageCircle size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input type="text" value={formData.whatsapp_no} onChange={(e) => setFormData({...formData, whatsapp_no: e.target.value})} style={{ width: '100%', padding: '10px 12px 10px 38px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', backgroundColor: '#f8fafc' }} placeholder="e.g. 25263XXXXXXX" />
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '6px', display: 'block' }}>CONTACT EMAIL</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '10px 12px 10px 38px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', backgroundColor: '#f8fafc' }} placeholder="email@wdo.org" />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '6px', display: 'block' }}>PROFILE PICTURE</label>
                <div style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '15px', textAlign: 'center', backgroundColor: '#f8fafc', position: 'relative' }}>
                  {uploading ? (
                    <Loader2 className="animate-spin mx-auto text-primary" size={20} />
                  ) : formData.image_url ? (
                    <div>
                      <img src={formData.image_url} alt="Preview" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', marginBottom: '8px' }} />
                      <div style={{ position: 'relative' }}>
                        <button type="button" style={{ padding: '5px 12px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: '700', fontSize: '0.75rem', cursor: 'pointer' }}>Change</button>
                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                      </div>
                    </div>
                  ) : (
                    <div style={{ position: 'relative' }}>
                      <ImageIcon size={20} color="#94a3b8" style={{ marginBottom: '5px' }} />
                      <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: '800' }}>Click to upload</p>
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 15px', backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer' }}>CANCEL</button>
                <button type="submit" disabled={loading} style={{ padding: '10px 20px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} {isEditing ? 'SAVE' : 'ADD'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
