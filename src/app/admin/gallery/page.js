'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Trash2, Plus, Image as ImageIcon, Folder, X, Edit, Save } from 'lucide-react'

export default function AdminGallery() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    folder_name: 'General'
  })

  const [userRole, setUserRole] = useState('Viewer')

  useEffect(() => {
    fetchPhotos()
    checkRole()

    // Real-time subscription
    const channel = supabase
      .channel('realtime:gallery')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'gallery' 
      }, () => {
        fetchPhotos()
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

  const fetchPhotos = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })
    
    setPhotos(data || [])
    setLoading(false)
  }

  const resetForm = () => {
    setFormData({ title: '', image_url: '', folder_name: 'General' })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEditClick = (photo) => {
    setFormData({
      title: photo.title,
      image_url: photo.image_url,
      folder_name: photo.folder_name || 'General'
    })
    setEditingId(photo.id)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      if (editingId) {
        const { error } = await supabase
          .from('gallery')
          .update(formData)
          .eq('id', editingId)
        
        if (error) throw error
        setPhotos(photos.map(p => p.id === editingId ? { ...p, ...formData } : p))
      } else {
        const { data, error } = await supabase
          .from('gallery')
          .insert([formData])
          .select()
        
        if (error) throw error
        setPhotos([data[0], ...photos])
      }
      resetForm()
    } catch (err) {
      alert("Error: " + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this photo?')) return
    const { error } = await supabase.from('gallery').delete().eq('id', id)
    if (error) {
      alert("Error: Only Admins can delete photos.")
    } else {
      setPhotos(photos.filter(p => p.id !== id))
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>GALLERY MANAGEMENT</h2>
        {(userRole === 'Super Admin' || userRole === 'Editor') && (
          <button 
            className="btn btn-primary"
            onClick={() => { if(showForm) resetForm(); else setShowForm(true); }}
            style={{ fontSize: '0.8rem', padding: '8px 20px' }}
          >
            {showForm ? <X size={16} style={{ marginRight: '8px' }} /> : <Plus size={16} style={{ marginRight: '8px' }} />}
            {showForm ? 'CANCEL' : 'ADD NEW PHOTO'}
          </button>
        )}
      </div>

      {showForm && (
        <div style={{ backgroundColor: 'white', border: '1px solid #ddd', padding: '30px', marginBottom: '30px', borderRadius: '2px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '20px' }}>
            {editingId ? 'EDIT PHOTO' : 'ADD NEW PHOTO'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2" style={{ gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '700', marginBottom: '8px', display: 'block' }}>ALBUM / FOLDER NAME</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.folder_name}
                  onChange={(e) => setFormData({...formData, folder_name: e.target.value})}
                  required
                  style={{ padding: '10px', border: '1px solid #ddd', width: '100%' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '700', marginBottom: '8px', display: 'block' }}>PHOTO TITLE</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  style={{ padding: '10px', border: '1px solid #ddd', width: '100%' }}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '25px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', marginBottom: '8px', display: 'block' }}>IMAGE URL (Direct Link)</label>
              <input 
                type="url" 
                className="form-control" 
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                placeholder="https://example.com/gallery/photo1.jpg"
                required
                style={{ padding: '10px', border: '1px solid #ddd', width: '100%' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary" disabled={saving} style={{ padding: '10px 30px', fontSize: '0.8rem', fontWeight: '800' }}>
                {saving ? 'SAVING...' : editingId ? 'UPDATE PHOTO' : 'SAVE PHOTO'}
              </button>
              <button type="button" className="btn btn-outline" onClick={resetForm} style={{ padding: '10px 30px', fontSize: '0.8rem', fontWeight: '800' }}>
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ backgroundColor: 'white', border: '1px solid #ddd', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ddd', backgroundColor: '#f9f9f9' }}>
              <th style={{ padding: '15px 20px', fontSize: '0.75rem', fontWeight: '800' }}>PREVIEW</th>
              <th style={{ padding: '15px 20px', fontSize: '0.75rem', fontWeight: '800' }}>ALBUM</th>
              <th style={{ padding: '15px 20px', fontSize: '0.75rem', fontWeight: '800' }}>TITLE</th>
              <th style={{ padding: '15px 20px', fontSize: '0.75rem', fontWeight: '800', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center' }}>Loading gallery...</td></tr>
            ) : photos.length === 0 ? (
              <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center' }}>No photos found.</td></tr>
            ) : (
              photos.map((photo) => (
                <tr key={photo.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px 20px' }}>
                    <div style={{ width: '60px', height: '40px', backgroundColor: '#f5f5f5', borderRadius: '2px', overflow: 'hidden' }}>
                       <img src={photo.image_url} alt={photo.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </td>
                  <td style={{ padding: '15px 20px', fontWeight: '700', fontSize: '0.8rem', color: 'var(--primary-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                       <Folder size={14} /> {photo.folder_name?.toUpperCase() || 'GENERAL'}
                    </div>
                  </td>
                  <td style={{ padding: '15px 20px', fontWeight: '600', fontSize: '0.85rem' }}>{photo.title}</td>
                  <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      {(userRole === 'Super Admin' || userRole === 'Editor') && (
                        <>
                          <button 
                            onClick={() => handleEditClick(photo)}
                            style={{ padding: '6px', backgroundColor: 'transparent', border: '1px solid #ddd', cursor: 'pointer', color: 'var(--primary-color)' }}
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(photo.id)}
                            style={{ padding: '6px', backgroundColor: 'transparent', border: '1px solid #ddd', cursor: 'pointer', color: '#dc3545' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
