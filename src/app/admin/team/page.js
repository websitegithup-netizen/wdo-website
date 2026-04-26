'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Plus, Edit2, Trash2, X, Save, 
  Image as ImageIcon, Loader2,
  CheckCircle2, AlertCircle, Search,
  User, Briefcase, Hash
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
    order_index: 0
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
        setStatus({ type: 'error', text: 'Database Error: Table "team" not found. Please create it in Supabase dashboard with columns: name, role, image_url, order_index.' })
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
              setFormData({ name: '', role: '', image_url: '', order_index: members.length })
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
                <button onClick={() => { setFormData(member); setIsEditing(member.id); setIsModalOpen(true); }} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '10px', color: '#0056b3', cursor: 'pointer' }}><Edit2 size={16} /></button>
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
          <div className="animate-fade-in" style={{ backgroundColor: 'white', borderRadius: '24px', width: '100%', maxWidth: '600px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ padding: '25px 30px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1e293b', margin: 0 }}>{isEditing ? 'Edit Member' : 'Add Team Member'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '30px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', display: 'block' }}>FULL NAME</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '12px 15px 12px 45px', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '1rem', outline: 'none', backgroundColor: '#f8fafc' }} placeholder="e.g. Dr. Ahmed Ali" />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', display: 'block' }}>ROLE / POSITION</label>
                <div style={{ position: 'relative' }}>
                  <Briefcase size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input type="text" required value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} style={{ width: '100%', padding: '12px 15px 12px 45px', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '1rem', outline: 'none', backgroundColor: '#f8fafc' }} placeholder="e.g. Executive Director" />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', display: 'block' }}>DISPLAY ORDER</label>
                <div style={{ position: 'relative' }}>
                  <Hash size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input type="number" required value={formData.order_index} onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value)})} style={{ width: '100%', padding: '12px 15px 12px 45px', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '1rem', outline: 'none', backgroundColor: '#f8fafc' }} />
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', display: 'block' }}>PROFILE PICTURE</label>
                <div style={{ border: '2px dashed #cbd5e1', borderRadius: '16px', padding: '20px', textAlign: 'center', backgroundColor: '#f8fafc', position: 'relative' }}>
                  {uploading ? (
                    <Loader2 className="animate-spin mx-auto text-primary" size={24} />
                  ) : formData.image_url ? (
                    <div>
                      <img src={formData.image_url} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px' }} />
                      <div style={{ position: 'relative' }}>
                        <button type="button" style={{ padding: '6px 15px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}>Change</button>
                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                      </div>
                    </div>
                  ) : (
                    <div style={{ position: 'relative' }}>
                      <ImageIcon size={24} color="#94a3b8" style={{ marginBottom: '8px' }} />
                      <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '800' }}>Click to upload</p>
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '12px 20px', backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}>CANCEL</button>
                <button type="submit" disabled={loading} style={{ padding: '12px 25px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} {isEditing ? 'SAVE' : 'ADD MEMBER'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
