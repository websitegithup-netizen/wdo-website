'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Users, FileText, MessageSquare, TrendingUp, 
  ArrowUpRight, Clock, CheckCircle2, AlertCircle,
  MapPin, Heart, Activity, Plus, Layout as SliderIcon
} from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    programs: 0,
    posts: 0,
    impact: 0,
    messages: 0
  })
  
  const [recentData, setRecentData] = useState({
    messages: [],
    posts: []
  })
  
  const [userName, setUserName] = useState('Administrator')
  const [greeting, setGreeting] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Set dynamic greeting based on time of day
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good Morning')
    else if (hour < 18) setGreeting('Good Afternoon')
    else setGreeting('Good Evening')

    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', user.id)
            .single()
          if (profile?.name) setUserName(profile.name)
        }

        const [programs, posts, impact, messages, recentMessages, recentPosts] = await Promise.all([
          supabase.from('programs').select('id', { count: 'exact' }),
          supabase.from('posts').select('id', { count: 'exact' }),
          supabase.from('impact_reports').select('id', { count: 'exact' }),
          supabase.from('contacts_messages').select('id', { count: 'exact' }),
          supabase.from('contacts_messages').select('name, subject, created_at').order('created_at', { ascending: false }).limit(3),
          supabase.from('posts').select('title, created_at').order('created_at', { ascending: false }).limit(3)
        ])

        setStats({
          programs: programs.count || 0,
          posts: posts.count || 0,
          impact: impact.count || 0,
          messages: messages.count || 0
        })

        setRecentData({
          messages: recentMessages.data || [],
          posts: recentPosts.data || []
        })
      } catch (err) {
        console.error("Dashboard fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #0056b3', borderRadius: '50%' }}></div>
      </div>
    )
  }

  // Format date helper
  const timeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    if (diffInHours < 24) return `${diffInHours} hours ago`
    return `${Math.floor(diffInHours / 24)} days ago`
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Premium Header */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        marginBottom: '40px', backgroundColor: 'white', padding: '30px', 
        borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        border: '1px solid #f1f5f9'
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1e293b', marginBottom: '8px' }}>
            {greeting}, {userName}! 👋
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>
            Here is what's happening with the WDO platform today.
          </p>
        </div>
        <div className="hidden-mobile" style={{ display: 'flex', gap: '15px' }}>
          <Link href="/admin/posts" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', backgroundColor: '#eff6ff', color: '#0056b3', borderRadius: '12px', fontWeight: '800', textDecoration: 'none' }}>
            <Plus size={18} /> New Post
          </Link>
          <Link href="/admin/slider" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', backgroundColor: '#0056b3', color: 'white', borderRadius: '12px', fontWeight: '800', textDecoration: 'none', boxShadow: '0 4px 15px rgba(0,86,179,0.3)' }}>
            <SliderIcon size={18} /> Manage Slider
          </Link>
        </div>
      </div>

      {/* Pro Stats Grid */}
      <div className="grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        {[
          { label: 'Total Programs', value: stats.programs, icon: <FileText size={24} />, color: '#0056b3', bg: '#eff6ff', trend: '+2 this month', link: '/admin/programs' },
          { label: 'Published Posts', value: stats.posts, icon: <TrendingUp size={24} />, color: '#10b981', bg: '#f0fdf4', trend: 'Growing', link: '/admin/posts' },
          { label: 'Impact Reports', value: stats.impact, icon: <CheckCircle2 size={24} />, color: '#8b5cf6', bg: '#f5f3ff', trend: 'Up to date', link: '/admin/impact' },
          { label: 'New Messages', value: stats.messages, icon: <MessageSquare size={24} />, color: '#f59e0b', bg: '#fffbeb', trend: 'Requires attention', link: '/admin/messages' }
        ].map((stat) => (
          <Link key={stat.label} href={stat.link} style={{ textDecoration: 'none' }}>
            <div style={{ 
              padding: '25px', backgroundColor: 'white', borderRadius: '24px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9',
              transition: 'transform 0.2s', cursor: 'pointer'
            }} className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ backgroundColor: stat.bg, padding: '15px', borderRadius: '16px', color: stat.color }}>
                  {stat.icon}
                </div>
                <ArrowUpRight size={20} color="#cbd5e1" />
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e293b', lineHeight: '1' }}>
                {stat.value}
              </div>
              <div style={{ color: '#64748b', fontWeight: '700', fontSize: '0.9rem', marginTop: '10px' }}>
                {stat.label}
              </div>
              <div style={{ color: stat.color, fontSize: '0.75rem', fontWeight: '800', marginTop: '15px', backgroundColor: stat.bg, padding: '5px 10px', borderRadius: '8px', display: 'inline-block' }}>
                {stat.trend}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid-responsive-2" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginBottom: '40px' }}>
        
        {/* Real-time Recent Activity */}
        <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#1e293b', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={22} color="#0056b3" /> System Activity
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {recentData.posts.map((post, i) => (
              <div key={`post-${i}`} style={{ display: 'flex', gap: '15px', alignItems: 'center', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '16px' }}>
                <div style={{ backgroundColor: '#e2e8f0', padding: '10px', borderRadius: '12px', color: '#64748b' }}>
                  <TrendingUp size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', margin: '0 0 5px 0' }}>New Post Published: {post.title}</p>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>{timeAgo(post.created_at)}</span>
                </div>
                <Link href="/admin/posts" style={{ color: '#0056b3', fontSize: '0.8rem', fontWeight: '800', textDecoration: 'none' }}>View</Link>
              </div>
            ))}

            {recentData.messages.map((msg, i) => (
              <div key={`msg-${i}`} style={{ display: 'flex', gap: '15px', alignItems: 'center', padding: '15px', backgroundColor: '#fffbeb', borderRadius: '16px' }}>
                <div style={{ backgroundColor: '#fde68a', padding: '10px', borderRadius: '12px', color: '#d97706' }}>
                  <MessageSquare size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', margin: '0 0 5px 0' }}>Message from {msg.name}</p>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>{msg.subject} • {timeAgo(msg.created_at)}</span>
                </div>
                <Link href="/admin/messages" style={{ color: '#d97706', fontSize: '0.8rem', fontWeight: '800', textDecoration: 'none' }}>Reply</Link>
              </div>
            ))}

            {recentData.posts.length === 0 && recentData.messages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                No recent activity to display.
              </div>
            )}
          </div>
        </div>

        {/* Global Impact Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#1e293b', marginBottom: '20px' }}>WDO Impact Focus</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {[
                { label: 'Total Beneficiaries', value: '15,000+', icon: <Users size={18} />, bg: '#eff6ff', color: '#0056b3' },
                { label: 'Active Regions', value: 'Somaliland', icon: <MapPin size={18} />, bg: '#f0fdf4', color: '#10b981' },
                { label: 'Focus Areas', value: 'Education & Health', icon: <Heart size={18} />, bg: '#fff1f2', color: '#e11d48' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ backgroundColor: item.bg, padding: '12px', borderRadius: '12px', color: item.color }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: '900', color: '#1e293b' }}>{item.value}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Support Card */}
          <div style={{ background: 'linear-gradient(135deg, #0056b3 0%, #003d82 100%)', padding: '30px', borderRadius: '24px', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1 }}>
              <AlertCircle size={150} />
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: 'white', marginBottom: '10px' }}>System Status</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
                All services are fully operational. Connected securely to Supabase Cloud infrastructure.
              </p>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', padding: '10px 15px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#4ade80', borderRadius: '50%' }}></div>
                DATABASE ONLINE
              </div>
            </div>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important;
        }
        @media (max-width: 991px) {
          .grid-responsive { grid-template-columns: repeat(2, 1fr) !important; }
          .grid-responsive-2 { grid-template-columns: 1fr !important; }
          .hidden-mobile { display: none !important; }
        }
        @media (max-width: 480px) {
          .grid-responsive { grid-template-columns: 1fr !important; }
        }
      `}} />
    </div>
  )
}
