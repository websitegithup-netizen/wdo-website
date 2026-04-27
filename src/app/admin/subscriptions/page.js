'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Bell, Mail, Trash2, Search, Download, 
  Loader2, CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react'

export default function SubscriptionsManagement() {
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [status, setStatus] = useState(null)

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      setStatus({ type: 'error', text: error.message })
    } else {
      setSubs(data || [])
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (confirm('Remove this email from subscriptions?')) {
      const { error } = await supabase.from('subscriptions').delete().eq('id', id)
      if (error) {
        setStatus({ type: 'error', text: 'Failed to delete' })
      } else {
        fetchSubscriptions()
        setStatus({ type: 'success', text: 'Email removed' })
      }
      setTimeout(() => setStatus(null), 3000)
    }
  }

  const exportToCSV = () => {
    const headers = ['Email', 'Subscribed At']
    const rows = subs.map(s => [s.email, new Date(s.created_at).toLocaleString()])
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `wdo_newsletter_subs_${new Date().toLocaleDateString()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredSubs = subs.filter(s => 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      <div className="responsive-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', gap: '15px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1e293b', margin: 0 }}>Newsletter Subscriptions</h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '5px' }}>View and manage audience emails for WDO updates.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={fetchSubscriptions}
            style={{ padding: '10px 15px', backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button 
            onClick={exportToCSV}
            disabled={subs.length === 0}
            style={{ padding: '10px 20px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 15px rgba(0,86,179,0.2)' }}
          >
            <Download size={18} /> EXPORT CSV
          </button>
        </div>
      </div>

      {status && (
        <div style={{ padding: '15px 20px', borderRadius: '12px', marginBottom: '25px', backgroundColor: status.type === 'success' ? '#ecfdf5' : '#fff1f2', color: status.type === 'success' ? '#059669' : '#e11d48', border: '1px solid ' + (status.type === 'success' ? '#10b981' : '#f43f5e'), display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', fontWeight: '800' }}>
          {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {status.text}
        </div>
      )}

      <div className="responsive-flex" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Search by email address..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '12px 15px 12px 45px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>
        <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#64748b', padding: '0 10px' }}>
          {filteredSubs.length} Total Subscriptions
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '15px 20px', fontSize: '0.75rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>Subscriber Email</th>
              <th style={{ padding: '15px 20px', fontSize: '0.75rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>Subscription Date</th>
              <th style={{ padding: '15px 20px', fontSize: '0.75rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="3" style={{ padding: '50px', textAlign: 'center' }}><Loader2 className="animate-spin mx-auto text-primary" size={30} /></td></tr>
            ) : filteredSubs.length === 0 ? (
              <tr><td colSpan="3" style={{ padding: '50px', textAlign: 'center', color: '#94a3b8', fontWeight: '700' }}>No subscribers found.</td></tr>
            ) : (
              filteredSubs.map((sub) => (
                <tr key={sub.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fcfcfc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '15px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#0056b3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mail size={16} /></div>
                      <span style={{ fontWeight: '700', color: '#1e293b' }}>{sub.email}</span>
                    </div>
                  </td>
                  <td style={{ padding: '15px 20px', color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>
                    {new Date(sub.created_at).toLocaleString()}
                  </td>
                  <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleDelete(sub.id)}
                      style={{ padding: '8px', backgroundColor: '#fff1f2', color: '#e11d48', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                      title="Delete Subscription"
                    >
                      <Trash2 size={16} />
                    </button>
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
