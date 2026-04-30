'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Image as ImageIcon, Camera, Folder, ChevronRight, LayoutGrid, Calendar, ArrowLeft, Loader2, X, Maximize2, Download } from 'lucide-react'

export default function Gallery() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const [lightboxImage, setLightboxImage] = useState(null)

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const { data, error } = await supabase
          .from('gallery')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setPhotos(data || [])
      } catch (err) {
        console.error('Error fetching gallery:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchPhotos()
  }, [])

  // Lock scroll and hide header when lightbox is open
  useEffect(() => {
    const header = document.querySelector('header');
    const topBar = document.querySelector('header')?.previousElementSibling;
    
    if (lightboxImage) {
      document.body.style.overflow = 'hidden'
      if (header) {
        header.style.transition = 'opacity 0.3s ease';
        header.style.opacity = '0';
        header.style.pointerEvents = 'none';
      }
      if (topBar && topBar.classList.contains('hidden-mobile')) {
        topBar.style.transition = 'opacity 0.3s ease';
        topBar.style.opacity = '0';
        topBar.style.pointerEvents = 'none';
      }
    } else {
      document.body.style.overflow = 'auto'
      if (header) {
        header.style.opacity = '1';
        header.style.pointerEvents = 'auto';
      }
      if (topBar && topBar.classList.contains('hidden-mobile')) {
        topBar.style.opacity = '1';
        topBar.style.pointerEvents = 'auto';
      }
    }
    
    return () => { 
      document.body.style.overflow = 'auto'
      if (header) {
        header.style.opacity = '1';
        header.style.pointerEvents = 'auto';
      }
      if (topBar && topBar.classList.contains('hidden-mobile')) {
        topBar.style.opacity = '1';
        topBar.style.pointerEvents = 'auto';
      }
    }
  }, [lightboxImage])

  // Group photos by folder
  const folders = photos?.reduce((acc, photo) => {
    const folder = photo.folder_name || 'General'
    if (!acc[folder]) acc[folder] = []
    acc[folder].push(photo)
    return acc
  }, {}) || {}

  const albumNames = Object.keys(folders)

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
        <Loader2 size={30} className="animate-spin" style={{ color: '#002654', opacity: 0.5 }} />
      </div>
    )
  }

  return (
    <div className="animate-fade-in" style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#1a1a1a', fontFamily: '"Inter", sans-serif' }}>
      
      {/* Header / Nav Area */}
      <header style={{ padding: '60px 0 40px', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '4px', textTransform: 'uppercase', color: '#888', marginBottom: '15px' }}>
             {selectedAlbum ? `Collection / ${selectedAlbum}` : 'Portfolio / Photography'}
          </h1>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '300', marginBottom: '30px', color: '#111' }}>
             Visual Excellence
          </h2>
          {!selectedAlbum && (
             <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem', color: '#666', lineHeight: '1.8', fontWeight: '400' }}>
               A curated selection of moments and impact from our development initiatives across the region.
             </p>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ paddingBottom: '100px' }}>
        <div className="container">
          
          {selectedAlbum && (
            <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'center' }}>
              <button 
                onClick={() => setSelectedAlbum(null)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: '1px solid #eee', 
                  padding: '10px 20px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700', 
                  color: '#666', cursor: 'pointer', transition: 'all 0.3s'
                }}
                className="btn-back"
              >
                <ArrowLeft size={14} /> BACK TO COLLECTIONS
              </button>
            </div>
          )}

          {!selectedAlbum ? (
            /* MINIMALIST ALBUMS VIEW */
            <div 
              className="album-grid-main"
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '20px',
                padding: '0 5px'
              }}
            >
              {albumNames.map((albumName) => {
                const albumPhotos = folders[albumName]
                const coverImage = albumPhotos[0]?.image_url
                
                return (
                  <div 
                    key={albumName} 
                    className="album-item"
                    onClick={() => setSelectedAlbum(albumName)}
                    style={{ cursor: 'pointer', position: 'relative' }}
                  >
                    <div style={{ 
                      borderRadius: '8px', overflow: 'hidden', aspectRatio: '1/1', 
                      boxShadow: '0 10px 30px rgba(0,0,0,0.04)', marginBottom: '15px',
                      backgroundColor: '#f9f9f9', transition: 'transform 0.5s cubic-bezier(0.2, 1, 0.3, 1)'
                    }}>
                      <img src={coverImage} alt={albumName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <h3 style={{ fontSize: '0.9rem', fontWeight: '700', margin: '0 0 5px', textTransform: 'uppercase', letterSpacing: '1px' }}>{albumName}</h3>
                      <p style={{ fontSize: '0.7rem', color: '#999', fontWeight: '500' }}>{albumPhotos.length} IMAGES</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* CLEAN GRID PHOTOS VIEW */
            <div 
              className="photo-grid-main"
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '12px',
                padding: '0 5px'
              }}
            >
              {folders[selectedAlbum].map((photo) => (
                <div 
                  key={photo.id} 
                  className="photo-item"
                  onClick={() => setLightboxImage(photo)}
                  style={{ 
                    borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', 
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)', backgroundColor: '#f9f9f9',
                    aspectRatio: '1/1', position: 'relative'
                  }}
                >
                  <img src={photo.image_url} alt={photo.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.6s' }} />
                  <div className="photo-overlay" style={{ 
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                    backgroundColor: 'rgba(0,0,0,0.2)', opacity: 0, transition: 'all 0.3s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Maximize2 size={24} color="white" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* REFINED MOBILE-FRIENDLY LIGHTBOX */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.98)', zIndex: 100000, 
            display: 'flex', flexDirection: 'column', padding: '0',
            cursor: 'zoom-out', touchAction: 'none'
          }} 
          className="animate-fade-in"
        >
          {/* Top Actions Layer */}
          <div style={{ 
            position: 'absolute', top: '0', left: 0, right: 0, 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '20px', zIndex: 100001 
          }}>
            <div style={{ color: 'white', opacity: 0.8, fontSize: '0.8rem', fontWeight: '700' }}>
               {lightboxImage.folder_name}
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setLightboxImage(null); }}
              style={{ 
                background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', 
                padding: '12px', borderRadius: '50%', color: 'white', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(10px)'
              }}
            >
              <X size={28} />
            </button>
          </div>
          
          {/* Image Container */}
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', 
              position: 'relative', cursor: 'default', padding: '10px' 
            }}
          >
            <img 
              src={lightboxImage.image_url} 
              alt={lightboxImage.title} 
              style={{ 
                maxHeight: '75vh', width: 'auto', maxWidth: '95vw', 
                objectFit: 'contain', borderRadius: '4px', 
                boxShadow: '0 0 40px rgba(0,0,0,0.5)' 
              }} 
            />
          </div>

          {/* Info & Download Bar */}
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              backgroundColor: 'rgba(10,10,10,0.9)', 
              padding: '25px 20px 40px', 
              borderTop: '1px solid rgba(255,255,255,0.1)',
              textAlign: 'center',
              backdropFilter: 'blur(15px)'
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 10px', color: 'white', letterSpacing: '0.5px' }}>
              {lightboxImage.title}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600' }}>
                 Added on {new Date(lightboxImage.created_at).toLocaleDateString()}
              </div>
              <a 
                href={lightboxImage.image_url} 
                download 
                target="_blank" 
                style={{ 
                  backgroundColor: '#ffc107', color: '#002654', 
                  padding: '12px 30px', borderRadius: '100px', 
                  fontWeight: '900', fontSize: '0.85rem', textDecoration: 'none',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 4px 15px rgba(255,193,7,0.3)'
                }}
              >
                <Download size={16} /> DOWNLOAD PHOTO
              </a>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ padding: '80px 0', borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '2px', color: '#999', textTransform: 'uppercase' }}>
           &copy; {new Date().getFullYear()} Waqal Development Organization
        </p>
      </footer>

      <style jsx global>{`
        .album-item:hover div { transform: translateY(-5px); }
        .album-item:hover h3 { color: #002654; }
        .photo-item:hover img { transform: scale(1.05); }
        .photo-item:hover .photo-overlay { opacity: 1; }
        .btn-back:hover { background-color: #f9f9f9 !important; color: #111 !important; border-color: #ddd !important; }

        @media (min-width: 769px) {
          .album-grid-main {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 40px !important;
            padding: 0 10px !important;
          }
          .photo-grid-main {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 30px !important;
            padding: 0 10px !important;
          }
        }
      `}</style>
    </div>
  )
}
