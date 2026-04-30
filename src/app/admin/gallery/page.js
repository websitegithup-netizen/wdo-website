'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Trash2, Plus, Image as ImageIcon, Folder, X, Edit, 
  Save, Loader2, UploadCloud, Search, Filter, 
  CheckSquare, Square, MoreVertical, Calendar,
  ArrowLeft, CheckCircle2, LayoutGrid, List
} from 'lucide-react'

export default function AdminGallery() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [editingPhoto, setEditingPhoto] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  
  // Selection & Filters
  const [selectedIds, setSelectedIds] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  
  const [formData, setFormData] = useState({
    title: '',
    folder_name: 'General',
    uploadedUrls: []
  })

  useEffect(() => {
    fetchPhotos()
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const fetchPhotos = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })
    
    setPhotos(data || [])
    setLoading(false)
  }

  const handleImageUpload = async (e) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    if (files.length === 0) return

    setUploading(true)
    setUploadProgress(10)
    
    try {
      const urls = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `gallery/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('wdo-assets')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('wdo-assets')
          .getPublicUrl(filePath)
          
        urls.push(publicUrl)
        setUploadProgress(10 + Math.round(((i + 1) / files.length) * 80))
      }

      setFormData(prev => ({ 
        ...prev, 
        uploadedUrls: [...prev.uploadedUrls, ...urls] 
      }))
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error uploading images.')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      if (editingPhoto) {
        const { error } = await supabase
          .from('gallery')
          .update({
            title: formData.title,
            folder_name: formData.folder_name
          })
          .eq('id', editingPhoto.id)
        
        if (error) throw error
      } else {
        if (formData.uploadedUrls.length === 0) {
          alert('Please upload at least one image.')
          setSaving(false)
          return
        }

        const inserts = formData.uploadedUrls.map((url, index) => ({
          title: formData.uploadedUrls.length > 1 ? `${formData.title} ${index + 1}` : formData.title,
          image_url: url,
          folder_name: formData.folder_name
        }))

        const { error } = await supabase.from('gallery').insert(inserts)
        if (error) throw error
      }
      
      setShowUploadModal(false)
      setEditingPhoto(null)
      setFormData({ title: '', folder_name: 'General', uploadedUrls: [] })
      fetchPhotos()
    } catch (err) {
      alert("Error: " + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this photo?')) return
    const { error } = await supabase.from('gallery').delete().eq('id', id)
    if (error) alert(error.message)
    else fetchPhotos()
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected photos?`)) return
    const { error } = await supabase.from('gallery').delete().in('id', selectedIds)
    if (error) alert(error.message)
    else {
      setSelectedIds([])
      fetchPhotos()
    }
  }

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const categories = ['All', ...new Set(photos.map(p => p.folder_name || 'General'))]
  
  const filteredPhotos = photos.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.folder_name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || p.folder_name === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="gallery-admin-container">
      
      {/* TOP HEADER SECTION */}
      <div className="header-actions">
        <div>
          <h2 className="page-title">Gallery Management</h2>
          <p className="page-subtitle">Manage your media assets efficiently.</p>
        </div>
        
        {/* Desktop Upload Button */}
        <button 
          onClick={() => {
            setEditingPhoto(null)
            setFormData({ title: '', folder_name: 'General', uploadedUrls: [] })
            setShowUploadModal(true)
          }}
          className="upload-btn desktop-only"
        >
          <Plus size={20} /> UPLOAD NEW PHOTO
        </button>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search images..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-box">
          <Filter size={18} />
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* BULK ACTIONS OVERLAY */}
      {selectedIds.length > 0 && (
        <div className="bulk-actions-overlay">
          <div className="bulk-info">
             <CheckSquare size={20} color="#ffc107" />
             <span>{selectedIds.length} items selected</span>
          </div>
          <div className="bulk-buttons">
            <button onClick={handleBulkDelete} className="bulk-delete-btn">
              <Trash2 size={18} /> <span className="desktop-only">DELETE</span>
            </button>
            <button onClick={() => setSelectedIds([])} className="bulk-cancel-btn">
              CANCEL
            </button>
          </div>
        </div>
      )}

      {/* PHOTO GRID */}
      {loading ? (
        <div className="loader-container"><Loader2 className="animate-spin" size={40} color="#002654" /></div>
      ) : filteredPhotos.length === 0 ? (
        <div className="empty-state">
          <ImageIcon size={64} color="#cbd5e1" />
          <h3>No images found.</h3>
        </div>
      ) : (
        <div className="photo-grid">
          {filteredPhotos.map((photo) => (
            <div 
              key={photo.id} 
              className={`photo-card ${selectedIds.includes(photo.id) ? 'selected' : ''}`}
            >
              {/* Checkbox */}
              <div onClick={() => toggleSelect(photo.id)} className="card-checkbox">
                {selectedIds.includes(photo.id) ? <CheckSquare size={24} fill="#002654" color="white" /> : <Square size={24} />}
              </div>

              {/* Image */}
              <div className="card-image" onClick={() => toggleSelect(photo.id)}>
                <img src={photo.image_url} alt={photo.title} loading="lazy" />
              </div>

              {/* Card Footer */}
              <div className="card-footer">
                <div className="card-info">
                  <div className="card-category">{photo.folder_name || 'General'}</div>
                  <h4 className="card-title">{photo.title || 'Untitled'}</h4>
                </div>
                
                <div className="card-actions">
                  <div className="card-date">
                    <Calendar size={12} /> {new Date(photo.created_at).toLocaleDateString()}
                  </div>
                  <div className="action-buttons">
                    <button 
                      onClick={() => {
                        setEditingPhoto(photo)
                        setFormData({ title: photo.title, folder_name: photo.folder_name, uploadedUrls: [] })
                        setShowUploadModal(true)
                      }}
                      className="edit-btn"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(photo.id)}
                      className="delete-btn"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FLOATING ACTION BUTTON (Mobile Only) */}
      <button 
        className="fab-upload mobile-only"
        onClick={() => {
          setEditingPhoto(null)
          setFormData({ title: '', folder_name: 'General', uploadedUrls: [] })
          setShowUploadModal(true)
        }}
      >
        <Plus size={28} />
      </button>

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-container animate-fade-up">
            <div className="modal-header">
              <div className="modal-header-left">
                <div className="modal-icon">
                   {editingPhoto ? <Edit size={24} /> : <UploadCloud size={24} />}
                </div>
                <div>
                  <h3>{editingPhoto ? 'Edit Photo' : 'Upload Photos'}</h3>
                </div>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="close-modal">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>ALBUM NAME</label>
                  <input 
                    type="text" 
                    value={formData.folder_name}
                    onChange={(e) => setFormData({...formData, folder_name: e.target.value})}
                    placeholder="e.g. Events"
                  />
                </div>
                <div className="form-group">
                  <label>PHOTO TITLE</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Workshop"
                  />
                </div>
              </div>

              {!editingPhoto && (
                <div className="upload-section">
                  <label>SELECT IMAGES</label>
                  <div 
                    onClick={() => document.getElementById('modal-upload').click()}
                    className="drop-zone"
                  >
                    {uploading ? (
                      <div className="uploading-state">
                        <Loader2 className="animate-spin" size={32} />
                        <div className="progress-bg">
                          <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                        <span>Uploading {uploadProgress}%</span>
                      </div>
                    ) : formData.uploadedUrls.length > 0 ? (
                      <div className="ready-state">
                        <div className="preview-thumbs">
                          {formData.uploadedUrls.slice(0, 5).map((url, i) => (
                            <img key={i} src={url} alt="Preview" />
                          ))}
                        </div>
                        <span className="success-text"><CheckCircle2 size={16} /> {formData.uploadedUrls.length} Ready</span>
                      </div>
                    ) : (
                      <div className="idle-state">
                        <UploadCloud size={40} color="#94a3b8" />
                        <p>Tap to Upload Images</p>
                      </div>
                    )}
                    <input id="modal-upload" type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </div>
                </div>
              )}

              <div className="form-footer">
                <button type="submit" disabled={saving || uploading} className="save-btn">
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                  {saving ? 'SAVING...' : 'PUBLISH'}
                </button>
                <button type="button" onClick={() => setShowUploadModal(false)} className="cancel-btn">
                  DISCARD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .gallery-admin-container {
          padding: 0;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .header-actions {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 30px;
          padding: 0 10px;
        }
        
        .page-title {
          font-size: 1.8rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0;
        }
        
        .page-subtitle {
          color: #64748b;
          font-size: 0.95rem;
          margin: 4px 0 0;
          font-weight: 500;
        }
        
        .upload-btn {
          background-color: #002654;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 10px 20px -5px rgba(0, 38, 84, 0.3);
        }
        
        .filters-bar {
          display: flex;
          gap: 12px;
          margin-bottom: 25px;
          padding: 0 10px;
        }
        
        .search-box, .filter-box {
          position: relative;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          display: flex;
          align-items: center;
          padding: 0 12px;
          flex: 1;
        }
        
        .search-box input, .filter-box select {
          width: 100%;
          border: none;
          padding: 12px 8px;
          font-size: 0.9rem;
          outline: none;
          background: transparent;
        }
        
        .bulk-actions-overlay {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #0f172a;
          padding: 12px 20px;
          border-radius: 16px;
          color: white;
          width: 90%;
          max-width: 600px;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3);
        }
        
        .bulk-info {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
        }
        
        .bulk-buttons {
          display: flex;
          gap: 10px;
        }
        
        .bulk-delete-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .bulk-cancel-btn {
          background: rgba(255,255,255,0.1);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
        }
        
        .photo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
          padding: 0 10px;
        }
        
        .photo-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #f1f5f9;
          overflow: hidden;
          position: relative;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          transition: all 0.2s;
        }
        
        .photo-card.selected {
          border-color: #002654;
          box-shadow: 0 0 0 3px rgba(0, 38, 84, 0.1);
        }
        
        .card-checkbox {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 10;
          cursor: pointer;
          color: rgba(255,255,255,0.9);
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }
        
        .photo-card.selected .card-checkbox {
          color: #002654;
          filter: none;
        }
        
        .card-image {
          height: 160px;
          background: #f8fafc;
          cursor: pointer;
        }
        
        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .card-footer {
          padding: 12px;
        }
        
        .card-category {
          font-size: 0.7rem;
          font-weight: 800;
          color: #0056b3;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        
        .card-title {
          font-size: 0.85rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .card-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #f1f5f9;
          padding-top: 10px;
        }
        
        .card-date {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #94a3b8;
          font-size: 0.7rem;
          font-weight: 600;
        }
        
        .action-buttons {
          display: flex;
          gap: 12px;
        }
        
        .edit-btn, .delete-btn {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .edit-btn { background: #f1f5f9; color: #475569; }
        .delete-btn { background: #fee2e2; color: #dc2626; }
        
        .fab-upload {
          position: fixed;
          bottom: 30px;
          right: 20px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #002654;
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 15px 30px rgba(0, 38, 84, 0.4);
          z-index: 900;
          cursor: pointer;
        }
        
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
        }
        
        .modal-container {
          background: white;
          border-radius: 24px;
          width: 100%;
          max-width: 600px;
          overflow: hidden;
        }
        
        .modal-header {
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #f1f5f9;
        }
        
        .modal-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .modal-icon {
          background: #eff6ff;
          color: #0056b3;
          padding: 8px;
          border-radius: 10px;
        }
        
        .modal-header h3 { font-weight: 900; margin: 0; }
        
        .close-modal {
          background: #f1f5f9;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        
        .modal-form { padding: 20px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        .form-group label { font-size: 0.75rem; font-weight: 800; color: #64748b; margin-bottom: 6px; display: block; }
        .form-group input { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 12px; outline: none; }
        
        .upload-section label { font-size: 0.75rem; font-weight: 800; color: #64748b; margin-bottom: 8px; display: block; }
        .drop-zone {
          border: 2px dashed #cbd5e1;
          border-radius: 16px;
          padding: 30px 15px;
          text-align: center;
          background: #f8fafc;
        }
        
        .progress-bg { width: 100%; max-width: 200px; height: 6px; background: #e2e8f0; border-radius: 10px; margin: 10px auto; overflow: hidden; }
        .progress-bar { height: 100%; background: #002654; transition: width 0.3s; }
        
        .preview-thumbs { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-bottom: 10px; }
        .preview-thumbs img { width: 45px; height: 45px; border-radius: 8px; object-fit: cover; }
        
        .form-footer { display: flex; gap: 12px; margin-top: 25px; }
        .save-btn { flex: 1; background: #002654; color: white; border: none; padding: 14px; border-radius: 12px; font-weight: 800; cursor: pointer; display: flex; alignItems: center; justifyContent: center; gap: 8px; }
        .cancel-btn { flex: 1; background: #f1f5f9; color: #475569; border: none; padding: 14px; border-radius: 12px; font-weight: 800; cursor: pointer; }

        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .photo-grid { grid-template-columns: repeat(2, 1fr); padding: 0 15px; gap: 15px; }
          .header-actions { margin-bottom: 20px; padding: 0 15px; }
          .page-title { font-size: 1.5rem; }
          .filters-bar { padding: 0 15px; flex-direction: column; }
          .form-grid { grid-template-columns: 1fr; }
          .bulk-actions-overlay { bottom: 100px; } /* Above FAB */
        }
        
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
        }
      `}</style>
    </div>
  )
}
