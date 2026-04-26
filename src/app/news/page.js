'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Calendar, Clock, ChevronRight, Newspaper, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function PublicNewsPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
      
      if (!error) setPosts(data)
      setLoading(false)
    }
    fetchPosts()
  }, [])

  return (
    <main style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      
      {/* Hero Header Section */}
      <section className="news-hero" style={{ 
        backgroundColor: '#ffffff', 
        padding: '30px 20px', 
        textAlign: 'center', 
        color: '#002654',
        borderBottom: '1px solid #f1f5f9'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 className="responsive-h1" style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '8px', letterSpacing: '-0.5px', color: '#002654' }}>WDO NEWS & UPDATES</h1>
          <p className="responsive-p" style={{ color: '#64748b', lineHeight: '1.4', fontSize: '0.95rem' }}>
            Latest initiatives and community impact stories in Somaliland.
          </p>
        </div>
      </section>

      {/* Main Blog Grid */}
      <section style={{ padding: '30px 20px', maxWidth: '1100px', margin: '0 auto' }}>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div className="animate-spin" style={{ width: '30px', height: '30px', border: '3px solid #f3f3f3', borderTop: '3px solid #002654', borderRadius: '50%', margin: '0 auto' }}></div>
            <p style={{ marginTop: '15px', fontSize: '0.9rem', color: '#666' }}>Fetching latest stories...</p>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
            <Newspaper size={40} color="#cbd5e1" style={{ marginBottom: '15px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#475569' }}>No News Articles Yet</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Check back later for updates from the WDO team.</p>
          </div>
        ) : (
          <div className="news-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {posts.map((post) => (
              <article key={post.id} style={{ 
                backgroundColor: 'white', 
                borderRadius: '16px', 
                overflow: 'hidden', 
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #f1f5f9'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
                  {post.image_url ? (
                    <img src={post.image_url} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                      <Newspaper size={40} />
                    </div>
                  )}
                  <div style={{ position: 'absolute', bottom: '12px', left: '12px', padding: '4px 10px', backgroundColor: '#002654', color: 'white', fontSize: '0.6rem', fontWeight: '900', borderRadius: '4px', textTransform: 'uppercase' }}>
                    NGO Update
                  </div>
                </div>

                <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> {new Date(post.created_at).toLocaleDateString()}
                  </div>

                  <h2 style={{ fontSize: '1rem', fontWeight: '900', color: '#1e293b', marginBottom: '10px', lineHeight: '1.3' }}>
                    {post.title}
                  </h2>
                  
                  <p style={{ 
                    color: '#64748b', 
                    fontSize: '0.8rem', 
                    lineHeight: '1.5', 
                    marginBottom: '15px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {post.content}
                  </p>

                  <Link href={`/news/${post.id}`} style={{ 
                    marginTop: 'auto',
                    color: '#002654', 
                    textDecoration: 'none', 
                    fontWeight: '800', 
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    READ STORY <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

      </section>

      {/* Newsletter Signup */}
      <section style={{ backgroundColor: '#f8fafc', padding: '40px 20px', textAlign: 'center', borderTop: '1px solid #e2e8f0' }}>
         <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '900', marginBottom: '10px' }}>Stay Connected</h3>
            <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '0.85rem' }}>Get the latest WDO stories and impact reports.</p>
            <div className="newsletter-form" style={{ display: 'flex', gap: '8px' }}>
               <input type="email" placeholder="Email address" style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.9rem' }} />
               <button style={{ padding: '10px 20px', backgroundColor: '#002654', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '0.8rem' }}>SUBSCRIBE</button>
            </div>
         </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .responsive-h1 { font-size: 1.8rem; }
        .responsive-p { font-size: 0.95rem; }
        @media (max-width: 768px) {
          .responsive-h1 { font-size: 1.4rem !important; }
          .responsive-p { font-size: 0.85rem !important; }
          .news-hero { padding: 30px 20px !important; }
          .newsletter-form { flex-direction: column !important; }
          .newsletter-form button { width: 100% !important; }
        }
      `}} />
    </main>
  )
}
