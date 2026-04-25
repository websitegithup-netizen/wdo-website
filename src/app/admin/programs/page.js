'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Plus, Edit2, Trash2, X, Save, 
  Image as ImageIcon, Loader2,
  CheckCircle2, AlertCircle, Camera
} from 'lucide-react'

export default function ProgramsManagement() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'education', // Match ENUM: education, health, youth, environment
    status: 'published',   // Match ENUM: draft, published
    image_url: '',
    created_at: new Date().toISOString().split('T')[0],
    objectives: ''
  })

  const [userRole, setUserRole] = useState('Viewer')

  useEffect(() => {
    fetchPrograms()
    checkRole()

    // Real-time subscription
    const channel = supabase
      .channel('realtime:programs')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'programs' 
      }, () => {
        fetchPrograms()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
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

  const fetchPrograms = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error) setPrograms(data)
    setLoading(false)
  }

  const handleImageUpload = async (e) => {
    try {
      setUploading(true)
      const file = e.target.files[0]
      if (!file) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `programs/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('wdo-assets')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('wdo-assets')
        .getPublicUrl(filePath)

      setFormData({ ...formData, image_url: publicUrl })
      setStatus({ type: 'success', text: 'Program image uploaded!' })
    } catch (error) {
      setStatus({ type: 'error', text: 'Image upload failed.' })
    } finally {
      setUploading(false)
      setTimeout(() => setStatus(null), 3000)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    const { objectives, ...rest } = formData
    const payload = {
      ...rest,
      category: formData.category.toLowerCase(),
      status: formData.status.toLowerCase(),
      impact_metrics: { objectives: formData.objectives }
    }

    if (isEditing) {
      const { error } = await supabase
        .from('programs')
        .update(payload)
        .eq('id', isEditing)
      
      if (error) {
        setStatus({ type: 'error', text: `Failed to update: ${error.message}` })
      } else {
        setStatus({ type: 'success', text: 'Program updated successfully!' })
        setIsModalOpen(false)
        fetchPrograms()
      }
    } else {
      // Get current user ID
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase
        .from('programs')
        .insert([{ ...payload, created_by: user?.id }])
      
      if (error) {
        setStatus({ type: 'error', text: `Failed to publish: ${error.message}` })
      } else {
        setStatus({ type: 'success', text: 'New program added!' })
        setIsModalOpen(false)
        fetchPrograms()
      }
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this program?')) {
      const { error } = await supabase.from('programs').delete().eq('id', id)
      if (!error) fetchPrograms()
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1a1a1a', margin: 0 }}>PROGRAMS MANAGEMENT</h2>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>Design and manage WDO initiatives.</p>
        </div>
        {(userRole === 'Super Admin' || userRole === 'Editor') && (
          <button 
            onClick={() => {
              setFormData({ title: '', description: '', category: 'education', status: 'published', image_url: '', created_at: new Date().toISOString().split('T')[0] })
              setIsEditing(null)
              setIsModalOpen(true)
            }}
            style={{ padding: '12px 25px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <Plus size={20} /> ADD NEW PROGRAM
          </button>
        )}
      </div>

      {status && (
        <div style={{ padding: '15px 20px', borderRadius: '12px', marginBottom: '25px', backgroundColor: status.type === 'success' ? '#ecfdf5' : '#fff1f2', color: status.type === 'success' ? '#059669' : '#e11d48', border: '1px solid ' + (status.type === 'success' ? '#10b981' : '#f43f5e'), display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', fontWeight: '700' }}>
          {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {status.text}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}><Loader2 className="animate-spin mx-auto text-primary" size={40} /></div>
        ) : (
          programs.map(program => (
            <div key={program.id} style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '15px', display: 'flex', alignItems: 'center', gap: '20px', transition: 'all 0.2s' }}>
              {/* Small Thumbnail */}
              <div style={{ width: '100px', height: '70px', borderRadius: '10px', backgroundColor: '#f1f5f9', overflow: 'hidden', flexShrink: 0 }}>
                {program.image_url ? (
                  <img src={program.image_url} alt={program.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}><ImageIcon size={24} /></div>
                )}
              </div>

              {/* Program Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{program.title}</h3>
                  <span style={{ fontSize: '0.65rem', padding: '2px 8px', backgroundColor: '#eff6ff', color: '#0056b3', borderRadius: '99px', fontWeight: '800', textTransform: 'uppercase' }}>
                    {program.category}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {program.description}
                </p>
              </div>

              {/* Status & Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '25px', flexShrink: 0 }}>
                <span style={{ fontSize: '0.7rem', color: program.status === 'published' ? '#059669' : '#e11d48', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: program.status === 'published' ? '#059669' : '#e11d48' }}></div>
                  {program.status.toUpperCase()}
                </span>
                
                {(userRole === 'Super Admin' || userRole === 'Editor') && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => { 
                      setIsEditing(program.id); 
                      setFormData({
                        ...program,
                        objectives: program.impact_metrics?.objectives || ''
                      }); 
                      setIsModalOpen(true); 
                    }} style={{ padding: '8px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', cursor: 'pointer' }}><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(program.id)} style={{ padding: '8px', backgroundColor: '#fff1f2', border: 'none', borderRadius: '8px', color: '#e11d48', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'white', width: '95%', maxWidth: '500px', borderRadius: '24px', padding: '25px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={24} /></button>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '10px' }}>{isEditing ? 'EDIT PROGRAM' : 'NEW PROGRAM'}</h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: '900', color: '#94a3b8', marginBottom: '8px', display: 'block' }}>PROGRAM IMAGE</label>
                <div 
                  onClick={() => document.getElementById('prog-img').click()}
                  style={{ width: '100%', height: '120px', border: '2px dashed #e2e8f0', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
                >
                  <input type="file" id="prog-img" hidden onChange={handleImageUpload} accept="image/*" />
                  {uploading ? <Loader2 className="animate-spin text-primary" /> : formData.image_url ? <img src={formData.image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <><Camera size={30} color="#94a3b8" /><span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '10px' }}>Upload cover image</span></>}
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: '900', color: '#94a3b8', marginBottom: '8px', display: 'block' }}>PROGRAM TITLE</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '10px 15px', border: '1px solid #e2e8f0', borderRadius: '10px' }} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: '900', color: '#94a3b8', marginBottom: '10px', display: 'block' }}>CATEGORY</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                    <option value="education">Education</option>
                    <option value="health">Health</option>
                    <option value="youth">Youth</option>
                    <option value="environment">Environment</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: '900', color: '#94a3b8', marginBottom: '10px', display: 'block' }}>STATUS</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: '900', color: '#94a3b8', marginBottom: '10px', display: 'block' }}>PROGRAM DATE (DATE HELD)</label>
                <input type="date" value={formData.created_at?.split('T')[0]} onChange={(e) => setFormData({...formData, created_at: e.target.value})} style={{ width: '100%', padding: '12px 15px', border: '1px solid #e2e8f0', borderRadius: '10px' }} required />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: '900', color: '#94a3b8', marginBottom: '10px', display: 'block' }}>KEY OBJECTIVES (ONE PER LINE)</label>
                <textarea value={formData.objectives} onChange={(e) => setFormData({...formData, objectives: e.target.value})} rows="3" placeholder="Objective 1&#10;Objective 2" style={{ width: '100%', padding: '12px 15px', border: '1px solid #e2e8f0', borderRadius: '10px', outline: 'none', resize: 'none' }}></textarea>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: '900', color: '#94a3b8', marginBottom: '10px', display: 'block' }}>DESCRIPTION</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="3" style={{ width: '100%', padding: '12px 15px', border: '1px solid #e2e8f0', borderRadius: '10px', outline: 'none', resize: 'none' }} required></textarea>
              </div>

              <button type="submit" disabled={loading} style={{ width: '100%', padding: '15px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer' }}>
                {loading ? 'SAVING...' : (isEditing ? 'UPDATE PROGRAM' : 'PUBLISH PROGRAM')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
