'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Calendar, Clock, ChevronLeft, Share2, Tag } from 'lucide-react'
import Link from 'next/link'

export default function NewsArticle() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()
      
      if (!error) setPost(data)
      setLoading(false)
    }
    fetchPost()
  }, [id])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
      <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #0056b3', borderRadius: '50%' }}></div>
    </div>
  )

  if (!post) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>Article not found</h2>
      <Link href="/news" className="btn btn-primary">Back to News</Link>
    </div>
  )

  return (
    <main style={{ backgroundColor: '#fff', minHeight: '100vh', paddingBottom: '100px' }}>
      
      {/* Article Hero */}
      <section style={{ backgroundColor: '#f8fafc', padding: '40px 0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <Link href="/news" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#0056b3', textDecoration: 'none', fontWeight: '700', marginBottom: '30px', fontSize: '0.9rem' }}>
            <ChevronLeft size={18} /> BACK TO UPDATES
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#64748b', fontSize: '0.85rem', fontWeight: '600', marginBottom: '20px' }}>
             <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {new Date(post.created_at).toLocaleDateString()}</span>
             <span style={{ backgroundColor: '#e2e8f0', padding: '2px 10px', borderRadius: '4px', fontSize: '0.7rem', color: '#475569' }}>NGO UPDATE</span>
          </div>

          <h1 className="article-title" style={{ fontWeight: '900', color: '#1e293b', marginBottom: '30px', lineHeight: '1.2' }}>
            {post.title}
          </h1>
        </div>
      </section>

      {/* Main Image */}
      {post.image_url && (
        <div className="container" style={{ maxWidth: '900px', marginTop: '-20px' }}>
          <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', backgroundColor: '#f1f5f9' }}>
            <img src={post.image_url} alt={post.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        </div>
      )}

      {/* Article Body */}
      <article className="container" style={{ maxWidth: '800px', padding: '60px 20px', margin: '0 auto' }}>
        <div 
          className="article-content"
          style={{ 
            fontSize: '1.15rem', 
            lineHeight: '1.8', 
            color: '#334155',
            overflowWrap: 'break-word',
            wordBreak: 'break-word'
          }}
          dangerouslySetInnerHTML={{ __html: post.content?.replace(/\n/g, '<br />') }}
        />

        {/* Share Section */}
        <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
             <span style={{ fontWeight: '800', color: '#1e293b', fontSize: '0.9rem' }}>Share this story:</span>
             <div style={{ display: 'flex', gap: '15px', color: '#64748b' }}>
                <Share2 size={18} cursor="pointer" />
             </div>
          </div>
          <Link href="/news" style={{ color: '#0056b3', fontWeight: '800', textDecoration: 'none', fontSize: '0.9rem' }}>Read more updates &rarr;</Link>
        </div>
      </article>

      <style dangerouslySetInnerHTML={{ __html: `
        .article-title { font-size: 3rem; }
        @media (max-width: 768px) {
          .article-title { font-size: 2rem !important; }
          .article-content { font-size: 1.05rem !important; line-height: 1.7 !important; }
          article.container { padding: 40px 15px !important; }
          .article-content img { width: 100% !important; height: auto !important; border-radius: 12px !important; margin: 20px 0 !important; }
        }
      `}} />
    </main>
  )
}
