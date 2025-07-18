import Link from "next/link"
import Head from "next/head"

export default function Home() {
  return (
    <>
      <Head>
        <title>Hylur BESS Platform</title>
        <meta name="description" content="Advanced Battery Energy Storage Systems platform with document management and AI analysis capabilities" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'white',
          maxWidth: '800px',
          padding: '2rem'
        }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🔋</div>
          
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            lineHeight: '1.2'
          }}>
            Hylur BESS Platform
          </h1>
          
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '2rem',
            opacity: 0.9,
            lineHeight: '1.6'
          }}>
            Advanced Battery Energy Storage Systems platform with document management and AI analysis capabilities.
            Built by energy sector experts for the future of renewable energy.
          </p>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '3rem'
          }}>
            <Link href="/login" style={{
              padding: '1rem 2rem',
              background: 'white',
              color: '#667eea',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '600',
              display: 'inline-block',
              fontSize: '1.1rem',
              transition: 'transform 0.2s'
            }}>
              🔐 Sign In
            </Link>
            
            <Link href="/dashboard" style={{
              padding: '1rem 2rem',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '600',
              display: 'inline-block',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontSize: '1.1rem',
              transition: 'transform 0.2s'
            }}>
              📊 Dashboard
            </Link>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            textAlign: 'left'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚡</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                Real-time Monitoring
              </h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.9, lineHeight: '1.5' }}>
                Monitor your battery systems in real-time with advanced analytics and predictive insights
              </p>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🤖</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                AI Analysis
              </h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.9, lineHeight: '1.5' }}>
                Leverage artificial intelligence for predictive maintenance and performance optimization
              </p>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📊</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                Document Management
              </h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.9, lineHeight: '1.5' }}>
                Centralized document management for all your BESS operations and compliance
              </p>
            </div>
          </div>
          
          <div style={{
            marginTop: '3rem',
            padding: '1.5rem',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '0.75rem',
            backdropFilter: 'blur(10px)'
          }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Founded by Energy Experts
            </h4>
            <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: 0 }}>
              Haukur (CEO) - 8+ years energy sector business development | 
              Leif (COO) - Mechatronics engineer specializing in energy systems & AI
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
