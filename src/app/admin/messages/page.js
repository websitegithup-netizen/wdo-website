'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Inbox, Star, Send, FileText, 
  Trash2, Archive, Reply, Forward, MoreVertical, CheckCircle2, User
} from 'lucide-react'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMsg, setSelectedMsg] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('Primary')
  const [activeMenu, setActiveMenu] = useState('Inbox')
  const [hoveredMsgId, setHoveredMsgId] = useState(null)

  useEffect(() => {
    fetchMessages()

    const channel = supabase
      .channel('realtime:contacts_messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contacts_messages' }, () => {
        fetchMessages()
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  const fetchMessages = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('contacts_messages')
      .select('*')
      .order('created_at', { ascending: false })
      
    // Ensure backwards compatibility by treating null status as 'inbox'
    if (data) {
      const normalizedData = data.map(msg => ({
        ...msg,
        status: msg.status || 'inbox',
        is_starred: msg.is_starred || false
      }))
      setMessages(normalizedData)
    }
    setLoading(false)
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    const msg = messages.find(m => m.id === id)
    
    if (msg.status === 'trash') {
      if (!confirm('Permanently delete this message?')) return
      const { error } = await supabase.from('contacts_messages').delete().eq('id', id)
      if (!error) {
        setMessages(messages.filter(m => m.id !== id))
        if (selectedMsg?.id === id) setSelectedMsg(null)
      }
    } else {
      // Move to trash
      const { error } = await supabase.from('contacts_messages').update({ status: 'trash' }).eq('id', id)
      if (!error) {
        setMessages(messages.map(m => m.id === id ? { ...m, status: 'trash' } : m))
        if (selectedMsg?.id === id) setSelectedMsg(null)
      }
    }
  }

  const handleArchive = async (e, id) => {
    e.stopPropagation()
    const { error } = await supabase.from('contacts_messages').update({ status: 'archived' }).eq('id', id)
    if (!error) {
      setMessages(messages.map(m => m.id === id ? { ...m, status: 'archived' } : m))
      if (selectedMsg?.id === id) setSelectedMsg(null)
    }
  }

  const handleUnarchive = async (e, id) => {
    e.stopPropagation()
    const { error } = await supabase.from('contacts_messages').update({ status: 'inbox' }).eq('id', id)
    if (!error) {
      setMessages(messages.map(m => m.id === id ? { ...m, status: 'inbox' } : m))
      if (selectedMsg?.id === id) setSelectedMsg(null)
    }
  }

  const toggleStar = async (e, id, currentStatus) => {
    e.stopPropagation()
    const newStatus = !currentStatus
    // Update local state instantly for better UX
    setMessages(messages.map(m => m.id === id ? { ...m, is_starred: newStatus } : m))
    await supabase.from('contacts_messages').update({ is_starred: newStatus }).eq('id', id)
  }

  const handleReply = () => {
    if(!selectedMsg) return
    // Mark as replied in DB
    supabase.from('contacts_messages').update({ replied_at: new Date().toISOString() }).eq('id', selectedMsg.id).then(() => {
      setMessages(messages.map(m => m.id === selectedMsg.id ? { ...m, replied_at: new Date().toISOString() } : m))
    })
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${selectedMsg.email}&su=${encodeURIComponent('Re: ' + (selectedMsg.subject || ''))}`
    window.open(gmailUrl, '_blank')
  }

  const handleForward = () => {
    if(!selectedMsg) return
    const body = `\n\n---------- Forwarded message ---------\nFrom: ${selectedMsg.name} <${selectedMsg.email}>\nDate: ${new Date(selectedMsg.created_at).toString()}\nSubject: ${selectedMsg.subject}\n\n${selectedMsg.message}`
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent('Fwd: ' + (selectedMsg.subject || ''))}&body=${encodeURIComponent(body)}`
    window.open(gmailUrl, '_blank')
  }

  const filteredMessages = messages.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.message?.toLowerCase().includes(searchQuery.toLowerCase())
                          
    if (!matchesSearch) return false

    // Filter by Sidebar Menu
    if (activeMenu === 'Inbox') return m.status === 'inbox'
    if (activeMenu === 'Starred') return m.is_starred === true
    if (activeMenu === 'Sent') return m.replied_at != null
    if (activeMenu === 'Drafts') return false // Drafts are handled in Gmail
    if (activeMenu === 'Archive') return m.status === 'archived'
    if (activeMenu === 'Trash') return m.status === 'trash'
    
    return true
  }).filter(m => {
    // Filter by Tabs (Simple mock implementation)
    if (activeTab === 'Primary') return true
    if (activeTab === 'Social') return m.message.toLowerCase().includes('facebook') || m.message.toLowerCase().includes('twitter')
    if (activeTab === 'Promotions') return m.message.toLowerCase().includes('offer') || m.message.toLowerCase().includes('discount')
    return true
  })

  // Tailwind Color Palette Mappings for Inline Styles
  const colors = {
    bgMain: '#ffffff',
    bgSidebar: '#fcfcfc',
    bgHover: '#f9fafb', // gray-50
    bgSelected: '#eff6ff', // blue-50
    bgSearch: '#f3f4f6', // gray-100
    borderLight: '#f3f4f6', // gray-100
    borderDark: '#e5e7eb', // gray-200
    textPrimary: '#111827', // gray-900
    textSecondary: '#4b5563', // gray-600
    textMuted: '#9ca3af', // gray-400
    accentBlue: '#2563eb', // blue-600
    accentRed: '#ef4444', // red-500
  }

  const sidebarMenu = [
    { name: 'Inbox', icon: <Inbox size={18} /> },
    { name: 'Starred', icon: <Star size={18} /> },
    { name: 'Sent', icon: <Send size={18} /> },
    { name: 'Archive', icon: <Archive size={18} /> },
    { name: 'Drafts', icon: <FileText size={18} /> },
    { name: 'Trash', icon: <Trash2 size={18} /> },
  ]

  const tabs = ['Primary', 'Social', 'Promotions']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)', backgroundColor: colors.bgMain, borderRadius: '16px', border: `1px solid ${colors.borderDark}`, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
      
      {/* Top Search Bar (Enterprise Header) */}
      <div style={{ height: '70px', borderBottom: `1px solid ${colors.borderLight}`, display: 'flex', alignItems: 'center', padding: '0 24px', gap: '20px', flexShrink: 0 }}>
        <div style={{ width: '220px', fontWeight: '900', fontSize: '1.2rem', color: colors.textPrimary, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: colors.accentBlue, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Inbox size={18} />
          </div>
          WDO Mail
        </div>
        
        <div style={{ flex: 1, maxWidth: '700px', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: colors.textSecondary }}>
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search mail" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', padding: '12px 16px 12px 48px', 
              backgroundColor: colors.bgSearch, border: 'none', 
              borderRadius: '24px', fontSize: '0.95rem', color: colors.textPrimary,
              outline: 'none', transition: 'all 0.2s',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
            }}
            onFocus={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.boxShadow = `0 1px 5px rgba(0,0,0,0.1), inset 0 0 0 1px ${colors.borderDark}`; }}
            onBlur={(e) => { e.target.style.backgroundColor = colors.bgSearch; e.target.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.02)'; }}
          />
        </div>
      </div>

      <div className="inbox-container" style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        
        {/* Column 1: Left Sidebar (Narrow) */}
        <div className={`inbox-sidebar ${selectedMsg ? 'hidden-on-mobile' : ''}`} style={{ width: '240px', backgroundColor: colors.bgMain, borderRight: `1px solid ${colors.borderLight}`, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
          {sidebarMenu.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveMenu(item.name)}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '12px 16px', borderRadius: '12px', border: 'none',
                backgroundColor: activeMenu === item.name ? colors.bgSelected : 'transparent',
                color: activeMenu === item.name ? colors.accentBlue : colors.textSecondary,
                fontWeight: activeMenu === item.name ? '700' : '600',
                fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => { if(activeMenu !== item.name) e.currentTarget.style.backgroundColor = colors.bgHover }}
              onMouseLeave={(e) => { if(activeMenu !== item.name) e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </div>

        {/* Column 2: Email List */}
        <div className={`inbox-list ${selectedMsg ? 'hidden-on-mobile' : ''}`} style={{ width: '400px', backgroundColor: colors.bgMain, borderRight: `1px solid ${colors.borderDark}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${colors.borderLight}`, padding: '0 10px', flexShrink: 0 }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1, padding: '16px 0', border: 'none', backgroundColor: 'transparent',
                  color: activeTab === tab ? colors.accentBlue : colors.textSecondary,
                  fontWeight: activeTab === tab ? '700' : '600',
                  fontSize: '0.85rem', cursor: 'pointer', position: 'relative'
                }}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTab"
                    style={{ position: 'absolute', bottom: 0, left: '10%', right: '10%', height: '3px', backgroundColor: colors.accentBlue, borderRadius: '3px 3px 0 0' }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: colors.textMuted }}>Loading...</div>
            ) : filteredMessages.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: colors.textMuted, fontSize: '0.9rem' }}>No messages found in {activeMenu}.</div>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMsg(msg)}
                  onMouseEnter={() => setHoveredMsgId(msg.id)}
                  onMouseLeave={() => setHoveredMsgId(null)}
                  style={{
                    padding: '16px 20px', borderBottom: `1px solid ${colors.borderLight}`,
                    backgroundColor: selectedMsg?.id === msg.id ? colors.bgSelected : (hoveredMsgId === msg.id ? colors.bgHover : 'white'),
                    cursor: 'pointer', transition: 'background-color 0.2s', position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '70%' }}>
                      <button 
                        onClick={(e) => toggleStar(e, msg.id, msg.is_starred)} 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: msg.is_starred ? colors.secondaryColor || '#eab308' : colors.borderDark }}
                      >
                        <Star size={16} fill={msg.is_starred ? '#eab308' : 'none'} color={msg.is_starred ? '#eab308' : colors.textMuted} />
                      </button>
                      <span style={{ fontWeight: msg.status === 'inbox' && !msg.replied_at ? '800' : '600', fontSize: '0.95rem', color: selectedMsg?.id === msg.id ? colors.accentBlue : colors.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {msg.name}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: colors.textMuted, fontWeight: '600' }}>
                      {new Date(msg.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  
                  <div style={{ fontWeight: '700', fontSize: '0.85rem', color: colors.textSecondary, marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {msg.subject || 'No Subject'}
                  </div>
                  
                  <div style={{ fontSize: '0.85rem', color: colors.textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {msg.message}
                  </div>

                  {/* Hover Actions */}
                  {hoveredMsgId === msg.id && (
                    <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '8px', backgroundColor: colors.bgHover, padding: '4px 8px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                      {(msg.status === 'archived' || msg.status === 'trash') && (
                        <button onClick={(e) => handleUnarchive(e, msg.id)} style={{ padding: '6px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: colors.accentBlue, borderRadius: '4px' }} onMouseEnter={(e)=>e.currentTarget.style.backgroundColor='#eff6ff'} onMouseLeave={(e)=>e.currentTarget.style.backgroundColor='transparent'} title="Move to Inbox">
                          <Inbox size={16} />
                        </button>
                      )}
                      {msg.status !== 'trash' && msg.status !== 'archived' && (
                        <button onClick={(e) => handleArchive(e, msg.id)} style={{ padding: '6px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: colors.textSecondary, borderRadius: '4px' }} onMouseEnter={(e)=>e.currentTarget.style.backgroundColor='#e5e7eb'} onMouseLeave={(e)=>e.currentTarget.style.backgroundColor='transparent'} title="Archive">
                          <Archive size={16} />
                        </button>
                      )}
                      <button onClick={(e) => handleDelete(e, msg.id)} style={{ padding: '6px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: colors.accentRed, borderRadius: '4px' }} onMouseEnter={(e)=>e.currentTarget.style.backgroundColor='#fee2e2'} onMouseLeave={(e)=>e.currentTarget.style.backgroundColor='transparent'} title={msg.status === 'trash' ? 'Delete Permanently' : 'Move to Trash'}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Email Content */}
        <div className={`inbox-content ${!selectedMsg ? 'hidden-on-mobile' : ''}`} style={{ flex: 1, backgroundColor: colors.bgMain, position: 'relative', overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            {selectedMsg ? (
              <motion.div
                key={selectedMsg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{ padding: '40px', minHeight: '100%' }}
              >
                {/* Email Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: colors.textPrimary, margin: 0, lineHeight: '1.3' }}>
                    {selectedMsg.subject || 'Message from WDO Website'}
                  </h2>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ padding: '8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: colors.textSecondary, borderRadius: '8px' }} onMouseEnter={(e)=>e.currentTarget.style.backgroundColor=colors.bgSearch} onMouseLeave={(e)=>e.currentTarget.style.backgroundColor='transparent'}>
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>

                {/* Sender Info & Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button className="mobile-back-btn" onClick={() => setSelectedMsg(null)} style={{ display: 'none', marginRight: '5px', background: 'none', border: 'none', color: colors.textSecondary, cursor: 'pointer' }}>
                      <Reply size={20} style={{ transform: 'scaleX(-1)' }} />
                    </button>
                    <div style={{ width: '48px', height: '48px', backgroundColor: colors.accentBlue, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(37,99,235,0.2)', flexShrink: 0 }}>
                      {selectedMsg.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontWeight: '800', fontSize: '1.05rem', color: colors.textPrimary }}>{selectedMsg.name}</span>
                        <span style={{ fontSize: '0.85rem', color: colors.textMuted }}>&lt;{selectedMsg.email}&gt;</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: colors.textMuted, marginTop: '2px' }}>
                        to me <span style={{ margin: '0 4px' }}>•</span> {new Date(selectedMsg.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Body */}
                <div style={{ 
                  fontSize: '1rem', lineHeight: '1.8', color: '#334155', 
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  paddingLeft: '64px' // align with text not avatar
                }}>
                  {selectedMsg.message}
                </div>

                {/* Actions */}
                <div style={{ marginTop: '50px', paddingLeft: '64px', display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={handleReply}
                    style={{ 
                      padding: '12px 24px', backgroundColor: colors.bgMain, border: `1px solid ${colors.borderDark}`, 
                      borderRadius: '24px', fontWeight: '700', fontSize: '0.9rem', color: colors.textSecondary,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e)=>e.currentTarget.style.backgroundColor=colors.bgSearch} 
                    onMouseLeave={(e)=>e.currentTarget.style.backgroundColor=colors.bgMain}
                  >
                    <Reply size={18} /> Reply
                  </button>
                  <button 
                    onClick={handleForward}
                    style={{ 
                      padding: '12px 24px', backgroundColor: colors.bgMain, border: `1px solid ${colors.borderDark}`, 
                      borderRadius: '24px', fontWeight: '700', fontSize: '0.9rem', color: colors.textSecondary,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e)=>e.currentTarget.style.backgroundColor=colors.bgSearch} 
                    onMouseLeave={(e)=>e.currentTarget.style.backgroundColor=colors.bgMain}
                  >
                    <Forward size={18} /> Forward
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: colors.borderDark }}
              >
                <Inbox size={80} strokeWidth={1} style={{ marginBottom: '20px' }} />
                <p style={{ color: colors.textMuted, fontSize: '1.1rem', fontWeight: '600' }}>Select an item to read</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 1024px) {
          .inbox-container { flex-direction: column; }
          .inbox-sidebar { width: 100% !important; border-right: none !important; border-bottom: 1px solid ${colors.borderLight}; flex-direction: row !important; overflow-x: auto; padding: 10px !important; }
          .inbox-sidebar button { white-space: nowrap; }
          .inbox-list { width: 100% !important; flex: 1; border-right: none !important; }
          .hidden-on-mobile { display: none !important; }
          .mobile-back-btn { display: block !important; }
        }
      `}} />
    </div>
  )
}
