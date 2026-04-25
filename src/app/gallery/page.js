import { supabase } from '@/lib/supabase'
import { Image as ImageIcon, Camera, Folder, ChevronRight } from 'lucide-react'

export const metadata = {
  title: 'Photo Gallery | WDO',
  description: 'Visual stories of our impact and community programs across Somaliland.',
}

export const dynamic = 'force-dynamic'

export default async function Gallery() {
  const { data: photos, error } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false })

  // Group photos by folder
  const folders = photos?.reduce((acc, photo) => {
    const folder = photo.folder_name || 'General'
    if (!acc[folder]) acc[folder] = []
    acc[folder].push(photo)
    return acc
  }, {}) || {}

  return (
    <div className="animate-fade-in">
      <section className="section-light" style={{ padding: '40px 0', borderBottom: '1px solid #eeeeee' }}>
        <div className="container">
          <h1 className="text-3xl font-bold" style={{ margin: 0 }}>PHOTO GALLERY</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {error ? (
            <div className="card text-center" style={{ padding: '40px' }}>
              <p className="text-accent">Error loading the gallery. Please try again.</p>
            </div>
          ) : Object.keys(folders).length === 0 ? (
            <div className="card text-center" style={{ padding: '40px' }}>
              <ImageIcon size={48} className="mx-auto mb-4 text-muted" />
              <p className="text-muted">No photos available at the moment.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
              {Object.entries(folders).map(([folderName, folderPhotos]) => (
                <div key={folderName}>
                  <div style={{ borderBottom: '2px solid var(--primary-color)', paddingBottom: '10px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Folder size={20} className="text-primary" />
                    <h2 className="text-2xl font-bold" style={{ margin: 0 }}>{folderName.toUpperCase()}</h2>
                    <span className="text-muted" style={{ marginLeft: 'auto', fontSize: '0.85rem' }}>{folderPhotos.length} Photos</span>
                  </div>
                  
                  <div className="grid grid-cols-3" style={{ gap: '20px' }}>
                    {folderPhotos.map((photo) => (
                      <div key={photo.id} style={{ border: '1px solid #eee', padding: '10px', backgroundColor: 'white' }}>
                        <div style={{ height: '280px', overflow: 'hidden' }}>
                          <img 
                            src={photo.image_url} 
                            alt={photo.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div style={{ padding: '15px 5px 5px' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '5px' }}>{photo.title}</h4>
                          <p style={{ fontSize: '0.75rem', color: '#999' }}>{new Date(photo.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section-light" style={{ padding: '60px 0' }}>
        <div className="container text-center">
          <div style={{ maxWidth: '800px', margin: '0 auto', border: '1px solid #eee', padding: '40px', backgroundColor: 'white' }}>
            <Camera size={32} className="text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-3">Media Requests</h3>
            <p className="text-muted">
              For high-resolution images or media kit requests, please contact our team at <strong>info@wdo-somaliland.org</strong>.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
