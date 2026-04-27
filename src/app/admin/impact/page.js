'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Trash2, Plus, FileText, X, Edit, Save } from 'lucide-react'

export default function AdminImpact() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    file_url: ''
  })

  const [userRole, setUserRole] = useState('Viewer')

  useEffect(() => {
    fetchReports()
    checkRole()

    // Real-time subscription
    const channel = supabase
      .channel('realtime:impact_reports')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'impact_reports' 
      }, () => {
        fetchReports()
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

  const fetchReports = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('impact_reports')
      .select('*')
      .order('year', { ascending: false })
    
    setReports(data || [])
    setLoading(false)
  }

  const resetForm = () => {
    setFormData({ title: '', year: new Date().getFullYear(), file_url: '' })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEditClick = (report) => {
    setFormData({
      title: report.title,
      year: report.year,
      file_url: report.file_url
    })
    setEditingId(report.id)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      if (editingId) {
        const { error } = await supabase
          .from('impact_reports')
          .update(formData)
          .eq('id', editingId)
        
        if (error) throw error
        setReports(reports.map(r => r.id === editingId ? { ...r, ...formData } : r))
      } else {
        const { data, error } = await supabase
          .from('impact_reports')
          .insert([formData])
          .select()
        
        if (error) throw error
        setReports([data[0], ...reports])
      }
      resetForm()
    } catch (err) {
      alert("Error: " + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this report?')) return
    const { error } = await supabase.from('impact_reports').delete().eq('id', id)
    if (error) {
      alert("Error: Only Admins can delete reports.")
    } else {
      setReports(reports.filter(r => r.id !== id))
    }
  }

  return (
    <div>
      <div className="responsive-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', gap: '15px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>IMPACT REPORTS MANAGEMENT</h2>
        {(userRole === 'Super Admin' || userRole === 'Editor') && (
          <button 
            className="btn btn-primary"
            onClick={() => { if(showForm) resetForm(); else setShowForm(true); }}
            style={{ fontSize: '0.8rem', padding: '8px 20px' }}
          >
            {showForm ? <X size={16} style={{ marginRight: '8px' }} /> : <Plus size={16} style={{ marginRight: '8px' }} />}
            {showForm ? 'CANCEL' : 'ADD NEW REPORT'}
          </button>
        )}
      </div>

      {showForm && (
        <div style={{ backgroundColor: 'white', border: '1px solid #ddd', padding: '30px', marginBottom: '30px', borderRadius: '2px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '20px' }}>
            {editingId ? 'EDIT REPORT' : 'UPLOAD NEW REPORT'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '700', marginBottom: '8px', display: 'block' }}>REPORT TITLE</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  style={{ padding: '10px', border: '1px solid #ddd', width: '100%' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '700', marginBottom: '8px', display: 'block' }}>REPORT YEAR</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                  required
                  style={{ padding: '10px', border: '1px solid #ddd', width: '100%' }}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '25px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', marginBottom: '8px', display: 'block' }}>PDF FILE URL</label>
              <input 
                type="url" 
                className="form-control" 
                value={formData.file_url}
                onChange={(e) => setFormData({...formData, file_url: e.target.value})}
                placeholder="https://example.com/reports/impact-2025.pdf"
                required
                style={{ padding: '10px', border: '1px solid #ddd', width: '100%' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary" disabled={saving} style={{ padding: '10px 30px', fontSize: '0.8rem', fontWeight: '800' }}>
                {saving ? 'SAVING...' : editingId ? 'UPDATE REPORT' : 'UPLOAD REPORT'}
              </button>
              <button type="button" className="btn btn-outline" onClick={resetForm} style={{ padding: '10px 30px', fontSize: '0.8rem', fontWeight: '800' }}>
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ backgroundColor: 'white', border: '1px solid #ddd', overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ddd', backgroundColor: '#f9f9f9' }}>
              <th style={{ padding: '15px 20px', fontSize: '0.75rem', fontWeight: '800' }}>TITLE</th>
              <th style={{ padding: '15px 20px', fontSize: '0.75rem', fontWeight: '800' }}>YEAR</th>
              <th style={{ padding: '15px 20px', fontSize: '0.75rem', fontWeight: '800' }}>DOCUMENT</th>
              <th style={{ padding: '15px 20px', fontSize: '0.75rem', fontWeight: '800', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center' }}>Loading...</td></tr>
            ) : reports.length === 0 ? (
              <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center' }}>No reports found.</td></tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px 20px', fontWeight: '600', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={16} className="text-primary" /> {report.title}
                    </div>
                  </td>
                  <td style={{ padding: '15px 20px', fontWeight: '700', fontSize: '0.85rem' }}>{report.year}</td>
                  <td style={{ padding: '15px 20px' }}>
                    <a href={report.file_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', fontSize: '0.8rem', fontWeight: '700' }}>VIEW PDF</a>
                  </td>
                  <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      {(userRole === 'Super Admin' || userRole === 'Editor') && (
                        <>
                          <button 
                            onClick={() => handleEditClick(report)}
                            style={{ padding: '6px', backgroundColor: 'transparent', border: '1px solid #ddd', cursor: 'pointer', color: 'var(--primary-color)' }}
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(report.id)}
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
