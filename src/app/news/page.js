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
        backgroundColor: '#0056b3', 
        padding: '80px 20px', 
        textAlign: 'center', 
        color: 'white',
        backgroundImage: 'linear-gradient(rgba(0,86,179,0.9), rgba(0,86,179,0.9)), url("https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 className="responsive-h1" style={{ fontWeight: '900', marginBottom: '15px', letterSpacing: '-0.5px' }}>WDO NEWS & UPDATES</h1>
          <p className="responsive-p" style={{ opacity: 0.9, lineHeight: '1.5' }}>
            Latest initiatives and community impact stories in Somaliland.
          </p>
        </div>
      </section>

      {/* Main Blog Grid */}
      <section style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #0056b3', borderRadius: '50%', margin: '0 auto' }}></div>
            <p style={{ marginTop: '20px', fontWeight: '600', color: '#666' }}>Fetching latest stories...</p>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px', backgroundColor: '#f8fafc', borderRadius: '24px', border: '1px dashed #e2e8f0' }}>
            <Newspaper size={60} color="#cbd5e1" style={{ marginBottom: '20px' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#475569' }}>No News Articles Yet</h3>
            <p style={{ color: '#64748b' }}>Check back later for updates from the WDO team.</p>
          </div>
        ) : (
          <div className="news-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
            {posts.map((post) => (
              <article key={post.id} style={{ 
                backgroundColor: 'white', 
                borderRadius: '24px', 
                overflow: 'hidden', 
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #f1f5f9'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                  {post.image_url ? (
                    <img src={post.image_url} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                      <Newspaper size={50} />
                    </div>
                  )}
                  <div style={{ position: 'absolute', bottom: '15px', left: '15px', padding: '6px 12px', backgroundColor: '#0056b3', color: 'white', fontSize: '0.65rem', fontWeight: '900', borderRadius: '6px', textTransform: 'uppercase' }}>
                    NGO Update
                  </div>
                </div>

                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Calendar size={13} /> {new Date(post.created_at).toLocaleDateString()}
                  </div>

                  <h2 style={{ fontSize: '1.15rem', fontWeight: '900', color: '#1e293b', marginBottom: '12px', lineHeight: '1.4' }}>
                    {post.title}
                  </h2>
                  
                  <p style={{ 
                    color: '#64748b', 
                    fontSize: '0.85rem', 
                    lineHeight: '1.6', 
                    marginBottom: '20px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {post.content}
                  </p>

                  <Link href={`/news/${post.id}`} style={{ 
                    marginTop: 'auto',
                    color: '#0056b3', 
                    textDecoration: 'none', 
                    fontWeight: '800', 
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    READ FULL STORY <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

      </section>

      {/* Newsletter Signup */}
      <section style={{ backgroundColor: '#f8fafc', padding: '60px 20px', textAlign: 'center', borderTop: '1px solid #e2e8f0' }}>
         <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '15px' }}>Stay Connected</h3>
            <p style={{ color: '#64748b', marginBottom: '30px', fontSize: '0.95rem' }}>Get the latest WDO stories and impact reports delivered directly to your inbox.</p>
            <div className="newsletter-form" style={{ display: 'flex', gap: '10px' }}>
               <input type="email" placeholder="Your email address" style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }} />
               <button style={{ padding: '14px 25px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}>SUBSCRIBE</button>
            </div>
         </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .responsive-h1 { font-size: 2.5rem; }
        .responsive-p { font-size: 1.1rem; }
        @media (max-width: 768px) {
          .responsive-h1 { font-size: 1.8rem !important; }
          .responsive-p { font-size: 0.95rem !important; }
          .news-hero { padding: 50px 20px !important; }
          .newsletter-form { flex-direction: column !important; }
          .newsletter-form button { width: 100% !important; }
        }
      `}} />
    </main>
  )
}
