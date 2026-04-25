'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Trash2, Mail, User, Clock, Inbox, Reply, Send, CheckCircle2 } from 'lucide-react'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMsg, setSelectedMsg] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [sendingReply, setSendingReply] = useState(false)

  useEffect(() => {
    fetchMessages()
    checkUserRole()

    // Real-time subscription
    const channel = supabase
      .channel('realtime:contacts_messages')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'contacts_messages' 
      }, () => {
        fetchMessages()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const checkUserRole = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
      setUserRole(data?.role || 'Viewer')
    }
  }

  const fetchMessages = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('contacts_messages')
      .select('*')
      .order('created_at', { ascending: false })
      
    if (!error && data) {
      setMessages(data)
    }
    setLoading(false)
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this message?')) return
    
    const { error } = await supabase.from('contacts_messages').delete().eq('id', id)
    
    if (error) {
      alert("Error: Only Admins can delete messages.")
    } else {
      setMessages(messages.filter(m => m.id !== id))
      if (selectedMsg?.id === id) setSelectedMsg(null)
    }
  }

  const handleSendReply = async () => {
    if (!replyText.trim()) return
    setSendingReply(true)
    
    try {
      // 1. Open GMAIL Compose in a new tab with pre-filled info
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${selectedMsg.email}&su=${encodeURIComponent('Re: ' + (selectedMsg.subject || 'WDO Inquiry'))}&body=${encodeURIComponent(replyText)}`;
      window.open(gmailUrl, '_blank');

      // 2. Update status in database for tracking
      const { error } = await supabase
        .from('contacts_messages')
        .update({
          reply_content: replyText,
          replied_at: new Date().toISOString()
        })
        .eq('id', selectedMsg.id)

      if (error) throw error

      // Update UI
      const updatedMessages = messages.map(m => 
        m.id === selectedMsg.id 
          ? { ...m, reply_content: replyText, replied_at: new Date().toISOString() } 
          : m
      )
      setMessages(updatedMessages)
      setSelectedMsg({ ...selectedMsg, reply_content: replyText, replied_at: new Date().toISOString() })
      setReplyText('')
    } catch (err) {
      console.error(err)
    } finally {
      setSendingReply(false)
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px', flexShrink: 0 }}>
        <div style={{ backgroundColor: '#0056b3', padding: '8px', borderRadius: '6px', color: 'white' }}>
          <Inbox size={20} />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>GMAIL INBOX PORTAL</h2>
      </div>

      <div style={{ 
        display: 'flex', 
        backgroundColor: 'white', 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        overflow: 'hidden',
        flex: 1,
        minHeight: 0 
      }}>
        {/* Messages List Column */}
        <div style={{ 
          width: '380px', 
          borderRight: '1px solid #eee', 
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: '#fcfcfc'
        }}>
          <div style={{ padding: '15px 20px', borderBottom: '1px solid #eee', backgroundColor: 'white', fontSize: '0.75rem', fontWeight: '800', color: '#888' }}>
            ALL INQUIRIES
          </div>
          
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center', fontSize: '0.8rem' }}>Loading...</div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id} 
                  onClick={() => { setSelectedMsg(msg); setReplyText(''); }}
                  style={{ 
                    padding: '20px', 
                    borderBottom: '1px solid #eee', 
                    cursor: 'pointer',
                    backgroundColor: selectedMsg?.id === msg.id ? '#f0f7ff' : 'white',
                    borderLeft: selectedMsg?.id === msg.id ? '5px solid #0056b3' : '5px solid transparent',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ fontWeight: '800', fontSize: '0.9rem', color: '#1a1a1a' }}>{msg.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#aaa' }}>{new Date(msg.created_at).toLocaleDateString()}</div>
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0056b3', marginBottom: '6px' }}>{msg.subject || 'Inquiry'}</div>
                  <div style={{ fontSize: '0.75rem', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.message}</div>
                  {msg.replied_at && (
                    <div style={{ marginTop: '5px', color: '#1e7e34', fontSize: '0.65rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} /> REPLIED VIA GMAIL
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Detail Column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'white' }}>
          {selectedMsg ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ padding: '30px 40px', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '900', margin: 0 }}>{selectedMsg.subject || 'Message from Website'}</h3>
                  {(userRole === 'Super Admin' || userRole === 'Editor') && (
                    <button onClick={(e) => handleDelete(e, selectedMsg.id)} style={{ color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={20} /></button>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.8rem', color: '#666' }}>
                  <div style={{ fontWeight: '800', color: '#222' }}>FROM: {selectedMsg.name}</div>
                  <div>&lt;{selectedMsg.email}&gt;</div>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '40px' }}>
                <div style={{ 
                  fontSize: '1.1rem', lineHeight: '1.8', color: '#222', 
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  marginBottom: '40px', backgroundColor: '#f9f9f9', padding: '30px', borderRadius: '10px'
                }}>
                  {selectedMsg.message}
                </div>

                {(userRole === 'Super Admin' || userRole === 'Editor') && (
                  <div style={{ borderTop: '2px solid #f0f0f0', paddingTop: '30px' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '900', color: '#0056b3', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Reply size={18} /> GMAIL QUICK RESPONSE
                    </h4>
                    <textarea 
                      rows="6"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your Gmail response here..."
                      style={{ width: '100%', padding: '20px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '1rem', resize: 'none', marginBottom: '15px' }}
                    ></textarea>
                    <button 
                      onClick={handleSendReply}
                      disabled={sendingReply || !replyText.trim()}
                      style={{ 
                        backgroundColor: '#ea4335', color: 'white', padding: '15px 40px', 
                        borderRadius: '8px', border: 'none', fontWeight: '800', 
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                        boxShadow: '0 4px 12px rgba(234,67,53,0.3)'
                      }}
                    >
                      <Mail size={20} /> OPEN IN GMAIL & SEND
                    </button>
                    <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '10px' }}>
                      * This will open Gmail Compose in a new tab with your message pre-filled.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
              <Mail size={80} style={{ opacity: 0.1, marginBottom: '20px' }} />
              <p style={{ fontWeight: '800' }}>Select a conversation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
