import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Head from "next/head"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      // Sample BESS facilities data
      setFacilities([
        {
          id: '1',
          name: 'Hylur Demo BESS Facility 1',
          location: 'Reykjavik, Iceland',
          capacity: 10.5,
          status: 'active',
          efficiency: 94.2,
          lastUpdate: '2 minutes ago'
        },
        {
          id: '2', 
          name: 'Hylur Demo BESS Facility 2',
          location: 'Akureyri, Iceland',
          capacity: 25.0,
          status: 'active',
          efficiency: 96.8,
          lastUpdate: '5 minutes ago'
        }
      ])
      setLoading(false)
    }
  }, [session])

  if (status === "loading") {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        background: '#f7fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔋</div>
          <div>Loading Hylur Platform...</div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'CEO': return '#e53e3e'
      case 'COO': return '#3182ce'
      default: return '#718096'
    }
  }

  const getRoleSpecificContent = () => {
    if (session.user.role === 'CEO') {
      return {
        title: 'Executive Dashboard',
        metrics: [
          { label: 'Total Revenue', value: '$2.4M', change: '+12%' },
          { label: 'Active Clients', value: '24', change: '+3' },
          { label: 'Pipeline Value', value: '$8.1M', change: '+18%' }
        ]
      }
    } else if (session.user.role === 'COO') {
      return {
        title: 'Technical Operations',
        metrics: [
          { label: 'System Efficiency', value: '95.5%', change: '+2.1%' },
          { label: 'Active Facilities', value: '12', change: '+1' },
          { label: 'AI Models Running', value: '8', change: '+2' }
        ]
      }
    }
    return {
      title: 'Platform Overview',
      metrics: [
        { label: 'Total Capacity', value: '35.5 MWh', change: '+5.2%' },
        { label: 'Active Systems', value: '2', change: '0' },
        { label: 'Uptime', value: '99.9%', change: '+0.1%' }
      ]
    }
  }

  const roleContent = getRoleSpecificContent()

  return (
    <>
      <Head>
        <title>Dashboard - Hylur BESS Platform</title>
        <meta name="description" content="Hylur Battery Energy Storage Systems dashboard" />
      </Head>
      
      <div style={{ minHeight: '100vh', background: '#f7fafc' }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '1rem 2rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '0.5rem' }}>🔋</span>
                Hylur BESS Platform
              </h1>
              <p style={{ color: '#718096', margin: '0.25rem 0 0 0' }}>
                Battery Energy Storage Systems Management
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '500', display: 'flex', alignItems: 'center' }}>
                  {session.user.name}
                  <span style={{
                    marginLeft: '0.5rem',
                    padding: '0.125rem 0.5rem',
                    background: getRoleColor(session.user.role),
                    color: 'white',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem'
                  }}>
                    {session.user.role}
                  </span>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                  {session.user.title}
                </div>
              </div>
              <button
                onClick={() => signOut()}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#e53e3e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ padding: '2rem' }}>
          {/* Welcome Section */}
          <div style={{
            background: 'white',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0 0 1rem 0' }}>
              Welcome back, {session.user.name?.split(' ')[0]}! 👋
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: '#edf2f7', borderRadius: '0.375rem' }}>
                <div style={{ fontSize: '0.875rem', color: '#718096' }}>Role</div>
                <div style={{ fontWeight: '600', color: getRoleColor(session.user.role) }}>{session.user.role}</div>
              </div>
              <div style={{ padding: '1rem', background: '#edf2f7', borderRadius: '0.375rem' }}>
                <div style={{ fontSize: '0.875rem', color: '#718096' }}>Department</div>
                <div style={{ fontWeight: '600' }}>{session.user.department || 'Not set'}</div>
              </div>
              <div style={{ padding: '1rem', background: '#edf2f7', borderRadius: '0.375rem' }}>
                <div style={{ fontSize: '0.875rem', color: '#718096' }}>Expertise</div>
                <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{session.user.expertise || 'Not set'}</div>
              </div>
            </div>
          </div>

          {/* Role-Specific Metrics */}
          <div style={{
            background: 'white',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: '0 0 1rem 0' }}>
              {roleContent.title}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              {roleContent.metrics.map((metric, index) => (
                <div key={index} style={{ textAlign: 'center', padding: '1rem', background: '#f7fafc', borderRadius: '0.375rem' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d3748' }}>{metric.value}</div>
                  <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.25rem' }}>{metric.label}</div>
                  <div style={{ fontSize: '0.75rem', color: metric.change.startsWith('+') ? '#38a169' : '#e53e3e' }}>
                    {metric.change}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BESS Facilities */}
          <div style={{
            background: 'white',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: '0 0 1rem 0' }}>
              BESS Facilities ({facilities.length})
            </h3>
            
            {loading ? (
              <div>Loading facilities...</div>
            ) : facilities.length > 0 ? (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {facilities.map((facility) => (
                  <div 
                    key={facility.id}
                    style={{
                      padding: '1rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.375rem',
                      display: 'grid',
                      gridTemplateColumns: '1fr auto auto auto',
                      gap: '1rem',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '500' }}>{facility.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                        📍 {facility.location}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: '600' }}>{facility.capacity} MWh</div>
                      <div style={{ fontSize: '0.75rem', color: '#718096' }}>Capacity</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: '600', color: '#38a169' }}>{facility.efficiency}%</div>
                      <div style={{ fontSize: '0.75rem', color: '#718096' }}>Efficiency</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.5rem',
                        background: facility.status === 'active' ? '#c6f6d5' : '#fed7d7',
                        color: facility.status === 'active' ? '#22543d' : '#c53030',
                        borderRadius: '0.25rem',
                        marginBottom: '0.25rem'
                      }}>
                        {facility.status}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#718096' }}>
                        {facility.lastUpdate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '2rem',
                color: '#718096'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔋</div>
                <div>No facilities found. Contact your administrator for access.</div>
              </div>
            )}
          </div>

          {/* System Status */}
          <div style={{
            background: 'white',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: '0 0 1rem 0' }}>
              System Status
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f0fff4', borderRadius: '0.375rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                <div style={{ fontWeight: '600', color: '#22543d' }}>Authentication</div>
                <div style={{ fontSize: '0.875rem', color: '#68d391' }}>Working</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f0fff4', borderRadius: '0.375rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💾</div>
                <div style={{ fontWeight: '600', color: '#22543d' }}>Database</div>
                <div style={{ fontSize: '0.875rem', color: '#68d391' }}>Connected</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#fffbf0', borderRadius: '0.375rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔗</div>
                <div style={{ fontWeight: '600', color: '#744210' }}>Google OAuth</div>
                <div style={{ fontSize: '0.875rem', color: '#d69e2e' }}>Setup Required</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
