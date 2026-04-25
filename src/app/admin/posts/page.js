'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Plus, Edit2, Trash2, X, Save, 
  Image as ImageIcon, Loader2,
  CheckCircle2, AlertCircle, Search, Filter,
  MoreVertical, CheckSquare, Square
} from 'lucide-react'

export default function BlogManagement() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState(null)
  
  // Advanced Features State
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedPosts, setSelectedPosts] = useState([])

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'published',
    image_url: ''
  })

  const [userRole, setUserRole] = useState('Viewer')

  useEffect(() => {
    fetchPosts()
    checkRole()

    // Real-time subscription
    const channel = supabase
      .channel('realtime:posts')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'posts' 
      }, () => {
        fetchPosts()
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

  const fetchPosts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error) setPosts(data)
    setLoading(false)
  }

  const handleImageUpload = async (e) => {
    try {
      setUploading(true)
      const file = e.target.files[0]
      if (!file) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `blog/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('wdo-assets')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('wdo-assets')
        .getPublicUrl(filePath)

      setFormData({ ...formData, image_url: publicUrl })
      setStatus({ type: 'success', text: 'Blog image uploaded!' })
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
      const { error } = await supabase.from('posts').update(formData).eq('id', isEditing)
      if (error) {
        setStatus({ type: 'error', text: `Failed: ${error.message}` })
      } else {
        setStatus({ type: 'success', text: 'Article updated!' })
        setIsModalOpen(false)
        fetchPosts()
      }
    } else {
      const { error } = await supabase.from('posts').insert([formData])
      if (error) {
        setStatus({ type: 'error', text: `Failed: ${error.message}` })
      } else {
        setStatus({ type: 'success', text: 'Article published!' })
        setIsModalOpen(false)
        fetchPosts()
      }
    }
    setLoading(false)
    setTimeout(() => setStatus(null), 3000)
  }

  // Bulk Actions & Selecting
  const toggleSelectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([])
    } else {
      setSelectedPosts(filteredPosts.map(p => p.id))
    }
  }

  const toggleSelect = (id) => {
    if (selectedPosts.includes(id)) {
      setSelectedPosts(selectedPosts.filter(pId => pId !== id))
    } else {
      setSelectedPosts([...selectedPosts, id])
    }
  }

  const handleBulkDelete = async () => {
    if (selectedPosts.length === 0) return
    if (confirm(`Are you sure you want to delete ${selectedPosts.length} selected posts?`)) {
      setLoading(true)
      const { error } = await supabase.from('posts').delete().in('id', selectedPosts)
      if (!error) {
        setStatus({ type: 'success', text: `${selectedPosts.length} posts deleted.` })
        setSelectedPosts([])
        fetchPosts()
      } else {
        setStatus({ type: 'error', text: 'Failed to delete selected posts.' })
      }
      setLoading(false)
      setTimeout(() => setStatus(null), 3000)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this article?')) {
      const { error } = await supabase.from('posts').delete().eq('id', id)
      if (!error) fetchPosts()
    }
  }

  // Filter & Search Logic
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Pro Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1e293b', margin: 0 }}>Content Management</h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '5px' }}>Manage blog posts, filter content, and perform bulk actions.</p>
        </div>
        {(userRole === 'Super Admin' || userRole === 'Editor') && (
          <button 
            onClick={() => {
              setFormData({ title: '', content: '', status: 'published', image_url: '' })
              setIsEditing(null)
              setIsModalOpen(true)
            }}
            style={{ padding: '12px 25px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 15px rgba(0,86,179,0.3)' }}
          >
            <Plus size={20} /> CREATE POST
          </button>
        )}
      </div>

      {status && (
        <div style={{ padding: '15px 20px', borderRadius: '12px', marginBottom: '25px', backgroundColor: status.type === 'success' ? '#ecfdf5' : '#fff1f2', color: status.type === 'success' ? '#059669' : '#e11d48', border: '1px solid ' + (status.type === 'success' ? '#10b981' : '#f43f5e'), display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', fontWeight: '800' }}>
          {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {status.text}
        </div>
      )}

      {/* Advanced Filter & Search Bar */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
        <div style={{ flex: 1, position: 'relative', minWidth: '250px' }}>
          <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Search by post title..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '12px 15px 12px 45px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f8fafc', padding: '10px 15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <Filter size={16} color="#64748b" />
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ background: 'none', border: 'none', outline: 'none', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b', cursor: 'pointer' }}
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
          
          {selectedPosts.length > 0 && (userRole === 'Super Admin' || userRole === 'Editor') && (
            <button onClick={handleBulkDelete} style={{ padding: '12px 20px', backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <Trash2 size={16} /> BULK DELETE ({selectedPosts.length})
            </button>
          )}
        </div>
      </div>

      {/* Pro Data Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '50px 80px 2fr 1fr 1fr 100px', padding: '15px 20px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: '800', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>
          <div style={{ cursor: 'pointer' }} onClick={toggleSelectAll}>
            {selectedPosts.length === filteredPosts.length && filteredPosts.length > 0 ? <CheckSquare size={18} color="#0056b3" /> : <Square size={18} />}
          </div>
          <div>Image</div>
          <div>Post Title</div>
          <div>Date</div>
          <div>Status</div>
          <div style={{ textAlign: 'right' }}>Actions</div>
        </div>

        {loading ? (
          <div style={{ padding: '50px', textAlign: 'center' }}><Loader2 className="animate-spin mx-auto text-primary" size={30} /></div>
        ) : filteredPosts.length === 0 ? (
          <div style={{ padding: '50px', textAlign: 'center', color: '#94a3b8', fontWeight: '600' }}>No posts found matching your criteria.</div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} style={{ display: 'grid', gridTemplateColumns: '50px 80px 2fr 1fr 1fr 100px', padding: '15px 20px', borderBottom: '1px solid #f1f5f9', alignItems: 'center', backgroundColor: selectedPosts.includes(post.id) ? '#eff6ff' : 'white', transition: 'background-color 0.2s' }}>
              <div style={{ cursor: 'pointer' }} onClick={() => toggleSelect(post.id)}>
                {selectedPosts.includes(post.id) ? <CheckSquare size={18} color="#0056b3" /> : <Square size={18} color="#cbd5e1" />}
              </div>
              <div>
                {post.image_url ? (
                  <img src={post.image_url} alt="Thumbnail" style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '50px', height: '50px', borderRadius: '8px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}><ImageIcon size={20} /></div>
                )}
              </div>
              <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '0.95rem' }}>{post.title}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>{new Date(post.created_at).toLocaleDateString()}</div>
              <div>
                <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', backgroundColor: post.status === 'published' ? '#dcfce7' : '#f1f5f9', color: post.status === 'published' ? '#166534' : '#64748b' }}>
                  {post.status || 'published'}
                </span>
              </div>
              {(userRole === 'Super Admin' || userRole === 'Editor') && (
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => {
                      setFormData({ title: post.title, content: post.content, status: post.status || 'published', image_url: post.image_url })
                      setIsEditing(post.id)
                      setIsModalOpen(true)
                    }} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0056b3' }}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(post.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: '20px' }}>
          <div className="animate-fade-in" style={{ backgroundColor: 'white', borderRadius: '24px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            
            <div style={{ padding: '25px 30px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 10 }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1e293b', margin: 0 }}>
                {isEditing ? 'Edit Post' : 'Create New Post'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '30px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginBottom: '25px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', display: 'block' }}>ARTICLE TITLE</label>
                  <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '1rem', outline: 'none', backgroundColor: '#f8fafc' }} placeholder="Enter a catchy title..." />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', display: 'block' }}>PUBLISH STATUS</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '1rem', outline: 'none', backgroundColor: '#f8fafc', fontWeight: '700' }}>
                    <option value="published">Published (Live)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', display: 'block' }}>COVER IMAGE</label>
                <div style={{ border: '2px dashed #cbd5e1', borderRadius: '16px', padding: '30px', textAlign: 'center', backgroundColor: '#f8fafc', position: 'relative' }}>
                  {uploading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#0056b3' }}>
                      <Loader2 className="animate-spin" size={30} />
                      <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Uploading secure asset...</span>
                    </div>
                  ) : formData.image_url ? (
                    <div>
                      <img src={formData.image_url} alt="Preview" style={{ height: '150px', borderRadius: '8px', objectFit: 'cover', marginBottom: '15px', border: '1px solid #e2e8f0' }} />
                      <div style={{ position: 'relative' }}>
                        <button type="button" style={{ padding: '8px 20px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', color: '#1e293b' }}>Change Image</button>
                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                      </div>
                    </div>
                  ) : (
                    <div style={{ position: 'relative' }}>
                      <div style={{ width: '60px', height: '60px', backgroundColor: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', color: '#0056b3' }}>
                        <ImageIcon size={30} />
                      </div>
                      <p style={{ margin: '0 0 5px 0', fontWeight: '800', color: '#1e293b' }}>Click to upload cover image</p>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>High quality JPEG/PNG up to 5MB</p>
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', display: 'block' }}>ARTICLE CONTENT</label>
                <textarea required value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} rows={10} style={{ width: '100%', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '0.95rem', outline: 'none', backgroundColor: '#f8fafc', lineHeight: '1.6', fontFamily: 'inherit' }} placeholder="Write your full article here..."></textarea>
              </div>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '14px 25px', backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}>
                  CANCEL
                </button>
                <button type="submit" disabled={loading} style={{ padding: '14px 30px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
                  {isEditing ? 'SAVE CHANGES' : 'PUBLISH POST'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
