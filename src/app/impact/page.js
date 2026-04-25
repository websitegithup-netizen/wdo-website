import { supabase } from '@/lib/supabase'
import { FileText, Download, TrendingUp, BarChart3, PieChart, ChevronRight } from 'lucide-react'

export const metadata = {
  title: 'Impact & Accountability | WDO',
  description: 'View our annual impact reports and transparency documentation.',
}

export const dynamic = 'force-dynamic'

export default async function Impact() {
  const { data: reports, error } = await supabase
    .from('impact_reports')
    .select('*')
    .order('year', { ascending: false })

  return (
    <div className="animate-fade-in">
      <section className="section-light" style={{ padding: '40px 0', borderBottom: '1px solid #eeeeee' }}>
        <div className="container">
          <h1 className="text-3xl font-bold" style={{ margin: 0 }}>IMPACT & ACCOUNTABILITY</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-cols-3" style={{ gap: '30px' }}>
            <div style={{ padding: '40px', backgroundColor: '#f9f9f9', textAlign: 'center', border: '1px solid #eee' }}>
              <TrendingUp size={36} className="text-primary mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Sustainable Growth</h3>
              <p className="text-sm text-muted">Measurable impact in every community we serve.</p>
            </div>
            <div style={{ padding: '40px', backgroundColor: '#f9f9f9', textAlign: 'center', border: '1px solid #eee' }}>
              <BarChart3 size={36} style={{ color: '#28a745', margin: '0 auto 15px' }} />
              <h3 className="text-lg font-bold mb-2">Data Integrity</h3>
              <p className="text-sm text-muted">Reports backed by ground-level data and research.</p>
            </div>
            <div style={{ padding: '40px', backgroundColor: '#f9f9f9', textAlign: 'center', border: '1px solid #eee' }}>
              <PieChart size={36} style={{ color: '#dc3545', margin: '0 auto 15px' }} />
              <h3 className="text-lg font-bold mb-2">Transparency</h3>
              <p className="text-sm text-muted">Clear accounting of resources and outcomes.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="container">
          <h2 className="text-2xl font-bold mb-10">Annual Reports</h2>
          
          {error ? (
            <div className="card text-center" style={{ padding: '40px' }}>
              <p className="text-accent">Error loading reports. Please try again later.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {reports?.map((report) => (
                <div key={report.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '20px 30px', 
                  backgroundColor: 'white', 
                  border: '1px solid #eee',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <FileText size={24} className="text-primary" />
                    <div>
                      <h4 className="font-bold" style={{ marginBottom: '2px' }}>{report.title}</h4>
                      <p className="text-sm text-muted">Published: {report.year}</p>
                    </div>
                  </div>
                  <a 
                    href={report.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-outline"
                    style={{ fontSize: '0.8rem', padding: '8px 20px' }}
                  >
                    <Download size={14} style={{ marginRight: '8px' }} /> DOWNLOAD PDF
                  </a>
                </div>
              ))}
              
              {reports?.length === 0 && (
                <div className="card text-center" style={{ padding: '40px' }}>
                  <p className="text-muted">No reports available yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <h2 className="text-2xl font-bold mb-6">Our Policies</h2>
          <p className="text-muted mb-8" style={{ lineHeight: '1.8' }}>
            WDO follows strict international standards for NGO operation. We maintain a zero-tolerance policy for corruption and ensure that 100% of donor funds reach their intended programs.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <span style={{ fontWeight: '700', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <ChevronRight size={16} /> NGO POLICY
            </span>
            <span style={{ fontWeight: '700', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <ChevronRight size={16} /> COMPLAINT PROCESS
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
