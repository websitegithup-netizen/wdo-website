'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpen, HeartPulse, Users, TreePine, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function HomeClient() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [posts, setPosts] = useState([])
  const [dbSlides, setDbSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  const defaultSlides = [
    {
      image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      title: 'Waqal Development Organization',
      description: 'Empowering communities through sustainable development and reliable initiatives across Somaliland.'
    }
  ]

  const activeSlides = dbSlides.length > 0 ? dbSlides : defaultSlides

  useEffect(() => {
    setMounted(true)
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    
    const fetchData = async () => {
      try {
        const { data: slidesData } = await supabase.from('hero_slides').select('*').order('order_index', { ascending: true })
        if (slidesData && slidesData.length > 0) setDbSlides(slidesData)

        const { data: newsData } = await supabase.from('posts').select('*').eq('status', 'published').order('created_at', { ascending: false }).limit(3)
        if (newsData) setPosts(newsData)
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (activeSlides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev === activeSlides.length - 1 ? 0 : prev + 1))
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [activeSlides.length])

  const nextSlide = () => setCurrentSlide((prev) => (prev === activeSlides.length - 1 ? 0 : prev + 1))
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1))

  return (
    <div style={{ backgroundColor: 'white' }}>
      
      {/* VIP Image Slider Section */}
      <section className="hero-slider" style={{ position: 'relative', height: isMobile ? '450px' : '100vh', maxHeight: isMobile ? '450px' : '650px', overflow: 'hidden', backgroundColor: '#ffffff' }}>
        {loading ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #002654', borderRadius: '50%' }}></div>
          </div>
        ) : (
          activeSlides.map((slide, index) => (
            <div key={index} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: currentSlide === index ? 1 : 0, transition: 'opacity 0.8s ease-in-out', zIndex: currentSlide === index ? 1 : 0 }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#002654', backgroundImage: `url(${slide.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', transform: 'scale(1)', transition: 'transform 3.5s ease-in-out' }}></div>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 38, 84, 0.5)' }}></div>
              <div className="slider-content" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', alignItems: 'center', padding: isMobile ? '0 5%' : '0 10%', color: 'white' }}>
                <div style={{ 
                  maxWidth: '800px', 
                  transform: currentSlide === index ? 'translateY(0)' : 'translateY(30px)', 
                  opacity: currentSlide === index ? 1 : 0, 
                  transition: 'all 0.8s ease-out 0.5s',
                  textAlign: 'left'
                }}>
                  <div style={{ width: isMobile ? '40px' : '60px', height: '4px', backgroundColor: '#ffc107', marginBottom: '15px' }}></div>
                  <h1 style={{ 
                    fontWeight: '900', 
                    lineHeight: '1.1', 
                    marginBottom: '15px', 
                    color: '#ffffff',
                    fontSize: isMobile ? '1.8rem' : '3.5rem',
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                  }}>
                    {slide.title}
                  </h1>
                  <div style={{ width: isMobile ? '40px' : '60px', height: '4px', backgroundColor: '#ffc107', marginBottom: '20px' }}></div>
                  <p style={{ 
                    fontSize: isMobile ? '0.9rem' : '1.1rem', 
                    lineHeight: '1.5', 
                    color: '#ffffff', 
                    marginBottom: '20px', 
                    opacity: 0.95,
                    maxWidth: '600px'
                  }}>
                    {slide.description}
                  </p>
                  
                  <Link 
                    href={
                      slide.title.toLowerCase().includes('education') ? '/programs/education' :
                      slide.title.toLowerCase().includes('health') ? '/programs/health' :
                      slide.title.toLowerCase().includes('youth') ? '/programs/youth' :
                      slide.title.toLowerCase().includes('environment') ? '/programs/environment' :
                      '/programs'
                    } 
                    style={{ 
                      display: 'inline-block',
                      backgroundColor: '#ffc107', 
                      color: '#1e293b', 
                      padding: isMobile ? '10px 25px' : '12px 35px', 
                      fontWeight: '900', 
                      fontSize: isMobile ? '0.85rem' : '1rem', 
                      textDecoration: 'none',
                      borderRadius: '2px',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                    }}
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}

        {!loading && activeSlides.length > 1 && (
          <>
            <button onClick={prevSlide} className="hidden-mobile" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 20, background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={30} /></button>
            <button onClick={nextSlide} className="hidden-mobile" style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 20, background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={30} /></button>
            <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', gap: '10px' }}>
              {activeSlides.map((_, i) => (<div key={i} onClick={() => setCurrentSlide(i)} style={{ width: currentSlide === i ? '30px' : '10px', height: '10px', borderRadius: '5px', backgroundColor: currentSlide === i ? '#0056b3' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.3s ease' }}></div>))}
            </div>
          </>
        )}
      </section>

      {/* About Section */}
      <section className="section animate-fade-up">
        <div className="container">
          <div className="grid grid-cols-2" style={{ alignItems: 'center' }}>
            <div>
              <h2 style={{ fontWeight: '900', marginBottom: '30px', borderLeft: '6px solid #0056b3', paddingLeft: '20px', color: '#1e293b' }}>About WDO</h2>
              <p style={{ fontSize: '1rem', color: '#64748b', lineHeight: '1.8', marginBottom: '25px' }}>
                Waqal Development Organization (WDO) is an independent, nonprofit, and nongovernmental organization providing project development solutions in the thematic areas of education, healthcare, youth development, and the environment. Based in Gabiley, Somaliland, WDO was established by a group of multi-disciplinary youth activists committed to delivering insightful and objective analyses on a broad range of social issues, including conflict, education, health, youth engagement, and environmental sustainability.
              </p>
              <Link href="/about/mission" className="btn btn-outline" style={{ padding: '12px 30px', fontWeight: '800' }}>Read More About Us</Link>
            </div>
            <div className="card" style={{ 
              padding: 0, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', 
              borderRadius: '24px', overflow: 'hidden', height: '100%', minHeight: '350px', position: 'relative', 
              display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}>
              <img src="/logo.png" alt="WDO Logo" style={{ width: '100%', maxWidth: '200px', marginBottom: '50px', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.08))' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '25px', background: 'linear-gradient(to top, rgba(0,86,179,0.95), transparent)', color: 'white' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '10px' }}>WDO Vision</h3>
                <p style={{ fontSize: '0.9rem', italic: 'true', lineHeight: '1.5', opacity: 0.9 }}>
                  "To create a future where every individual in Somaliland has access to quality education, healthcare, youth development opportunities, and sustainable environmental practices."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="section animate-fade-up delay-200" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 className="responsive-h2" style={{ fontWeight: '900', marginBottom: '15px' }}>Our Core Programs</h2>
            <p style={{ color: '#64748b' }}>Targeted interventions for sustainable growth in Somaliland.</p>
          </div>
          <div className="grid grid-cols-4" style={{ gap: '20px' }}>
            {[
              { title: 'Improving Education', icon: <BookOpen />, desc: 'Enhancing educational access for vulnerable households and climate-affected communities through innovative technologies and community resources.', delay: 'delay-100' },
              { title: 'Improving Healthcare', icon: <HeartPulse />, desc: 'Ensuring children and women receive safe, timely, and effective services while conducting awareness initiatives on gender equality and protection.', delay: 'delay-200' },
              { title: 'Youth Development', icon: <Users />, desc: "Improving access to equitable quality basic services, skills, and educational opportunities for Somaliland's youth.", delay: 'delay-300' },
              { title: 'Environmental Improvement', icon: <TreePine />, desc: 'Promoting initiatives for environmental sustainability and conservation.', delay: 'delay-500' }
            ].map((program) => (
              <div key={program.title} className={`card hover-scale animate-fade-up ${program.delay}`} style={{ padding: '30px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ backgroundColor: '#0056b3', color: 'white', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', flexShrink: 0 }}>{program.icon}</div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '12px', color: '#1e293b' }}>{program.title}</h4>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>{program.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="section animate-fade-up">
        <div className="container">
          <div className="flex-mobile-stack" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <h2 className="responsive-h2" style={{ fontWeight: '900' }}>Latest Updates</h2>
            <Link href="/news" style={{ color: '#0056b3', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px' }}>View All News <ArrowRight size={20} /></Link>
          </div>
          <div className="grid grid-cols-1" style={{ gap: '20px' }}>
            {posts.slice(0, 1).map((post) => (
              <div key={post.id} className="flex-mobile-stack hover-scale" style={{ display: 'flex', gap: '25px', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '25px', padding: '15px', borderRadius: '16px' }}>
                <div style={{ width: '120px', height: '120px', borderRadius: '16px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#f8fafc' }}>
                  {post.image_url ? <img src={post.image_url} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}><Calendar size={30} /></div>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#0056b3', fontWeight: '900', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '8px' }}>{new Date(post.created_at).toLocaleDateString()}</div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#1e293b', marginBottom: '10px' }}>{post.title}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '15px', overflowWrap: 'break-word', wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.content}</p>
                  <Link href={`/news/${post.id}`} style={{ color: '#0056b3', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem' }}>READ MORE <ArrowRight size={14} /></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ backgroundColor: '#002654', textAlign: 'center', color: 'white', padding: '40px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: isMobile ? '1.5rem' : '2.2rem', fontWeight: '900', marginBottom: '15px', color: 'white' }}>Support Our Cause</h2>
          <p style={{ fontSize: isMobile ? '0.9rem' : '1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 25px' }}>Join us in building a resilient and socially responsible society in Somaliland.</p>
          <Link href="/donate" style={{ 
            display: 'inline-block',
            backgroundColor: '#ffc107', 
            color: '#002654', 
            padding: isMobile ? '10px 25px' : '12px 35px', 
            fontSize: isMobile ? '0.85rem' : '1rem',
            fontWeight: '900',
            textDecoration: 'none',
            borderRadius: '2px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}>Donate Now</Link>
        </div>
      </section>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .responsive-h1 { font-size: 2.8rem; }
        .responsive-h2 { font-size: 2.2rem; }
        .responsive-p { font-size: 1.1rem; }
        @media (max-width: 768px) {
          .hero-slider { height: 400px !important; }
          .responsive-h1 { 
            font-size: 1.3rem !important; 
            line-height: 1.3 !important;
          }
          .responsive-h2 { font-size: 1.8rem !important; }
          .responsive-p { font-size: 0.75rem !important; line-height: 1.5 !important; }
          .slider-content { padding: 0 15px 30px !important; }
          .slider-content > div { 
            padding: 15px !important; 
            border-radius: 4px !important;
            border-left-width: 4px !important;
          }
          .section { padding: 40px 0 !important; }
        }
      `}} />
    </div>
  )
}
