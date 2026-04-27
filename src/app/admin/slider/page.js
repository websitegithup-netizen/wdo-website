'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Plus, Trash2, Image as ImageIcon, Save, 
  Loader2, AlertCircle, CheckCircle2, Layout,
  Type, AlignLeft, ArrowUp, ArrowDown
} from 'lucide-react'

export default function AdminSlider() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: ''
  })
  const [isEditing, setIsEditing] = useState(null)

  const [userRole, setUserRole] = useState('Viewer')

  useEffect(() => {
    fetchSlides()
    checkRole()

    // Real-time subscription
    const channel = supabase
      .channel('realtime:hero_slider')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'hero_slider' 
      }, () => {
        fetchSlides()
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

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('order_index', { ascending: true })
      
      if (error) throw error
      setSlides(data || [])
    } catch (err) {
      console.error('Error fetching slides:', err)
      setError('Could not load slides. Make sure the hero_slides table exists.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      if (isEditing) {
        const { error } = await supabase
          .from('hero_slides')
          .update({
            title: formData.title,
            description: formData.description,
            image_url: formData.image_url
          })
          .eq('id', isEditing)

        if (error) throw error
        setSuccess('Slide updated successfully!')
      } else {
        const { error } = await supabase
          .from('hero_slides')
          .insert([{
            ...formData,
            order_index: slides.length
          }])

        if (error) throw error
        setSuccess('Slide added successfully!')
      }
      
      setFormData({ title: '', description: '', image_url: '' })
      setIsEditing(null)
      fetchSlides()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEditClick = (slide) => {
    setFormData({
      title: slide.title,
      description: slide.description,
      image_url: slide.image_url
    })
    setIsEditing(slide.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetForm = () => {
    setFormData({ title: '', description: '', image_url: '' })
    setIsEditing(null)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this slide?')) return

    try {
      const { error } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchSlides()
    } catch (err) {
      setError(err.message)
    }
  }

  const resizeImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target.result
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const maxWidth = 1920
          const maxHeight = 1080
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width)
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height)
              height = maxHeight
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)

          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }))
          }, 'image/jpeg', 0.8)
        }
      }
    })
  }

  const handleFileUpload = async (e) => {
    const originalFile = e.target.files[0]
    if (!originalFile) return

    setSaving(true)
    try {
      // Resize image before upload to maintain quality and fast loading
      const file = await resizeImage(originalFile)

      const fileExt = 'jpg'
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `hero-slides/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('wdo-assets')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('wdo-assets')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, image_url: publicUrl }))
    } catch (err) {
      setError('Image upload failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="responsive-flex" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#1e293b', marginBottom: '10px' }}>Slider Management</h1>
        <p style={{ color: '#64748b' }}>Design and manage the premium hero slider for the homepage.</p>
      </header>

      {/* Messages */}
      {error && (
        <div style={{ padding: '15px', backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertCircle size={20} /> {error}
        </div>
      )}
      {success && (
        <div style={{ padding: '15px', backgroundColor: '#f0fdf4', color: '#166534', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={20} /> {success}
        </div>
      )}

      <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px' }}>
        
        {/* Add New Slide Form - Hidden for Viewers */}
        {(userRole === 'Super Admin' || userRole === 'Editor') && (
          <div id="slide-form" style={{ backgroundColor: 'white', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                {isEditing ? <Layout size={20} color="#0056b3" /> : <Plus size={20} color="#0056b3" />} 
                {isEditing ? 'Edit Slide' : 'Add New Slide'}
              </h2>
              {isEditing && (
                <button onClick={resetForm} style={{ background: 'none', border: 'none', color: '#64748b', fontWeight: '700', cursor: 'pointer', fontSize: '0.8rem' }}>CANCEL</button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>SLIDE IMAGE</label>
                <div 
                  onClick={() => document.getElementById('slide-upload').click()}
                  style={{ 
                    height: '180px', border: '2px dashed #e2e8f0', borderRadius: '16px', 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                    cursor: 'pointer', overflow: 'hidden', backgroundColor: '#f8fafc', position: 'relative'
                  }}
                >
                  {formData.image_url ? (
                    <img src={formData.image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                  ) : (
                    <>
                      <ImageIcon size={40} color="#94a3b8" />
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '10px' }}>Click to upload slide image</span>
                    </>
                  )}
                  <input id="slide-upload" type="file" hidden accept="image/*" onChange={handleFileUpload} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>SLIDE TITLE</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Empowering Local Communities"
                  style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>DESCRIPTION</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Briefly describe what this slide represents..."
                  style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', resize: 'none' }} 
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={saving}
                style={{ 
                  backgroundColor: '#0056b3', color: 'white', padding: '15px', borderRadius: '12px', 
                  fontWeight: '800', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' 
                }}
              >
                {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />} 
                {isEditing ? 'UPDATE SLIDE' : 'PUBLISH SLIDE'}
              </button>
            </form>
          </div>
        )}

        {/* Existing Slides List */}
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layout size={20} color="#0056b3" /> Active Slides ({slides.length})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {loading ? (
              <p>Loading slides...</p>
            ) : slides.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '24px', border: '1px dashed #e2e8f0' }}>
                <ImageIcon size={40} color="#cbd5e1" style={{ marginBottom: '15px' }} />
                <p style={{ color: '#94a3b8' }}>No slides added yet. The homepage is currently using default images.</p>
              </div>
            ) : (
              slides.map((slide) => (
                <div key={slide.id} style={{ 
                  backgroundColor: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden',
                  display: 'flex', gap: '20px', padding: '15px'
                }}>
                  <div style={{ width: '150px', height: '100px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={slide.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1e293b', marginBottom: '5px' }}>{slide.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.4', marginBottom: '10px' }}>{slide.description}</p>
                    <div style={{ display: 'flex', gap: '20px' }}>
                      {(userRole === 'Super Admin' || userRole === 'Editor') && (
                        <>
                          <button onClick={() => handleEditClick(slide)} style={{ background: 'none', border: 'none', color: '#0056b3', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <ImageIcon size={14} /> EDIT
                          </button>
                          <button onClick={() => handleDelete(slide.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Trash2 size={14} /> REMOVE
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
