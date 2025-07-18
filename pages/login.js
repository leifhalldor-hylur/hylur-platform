import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Head from "next/head"

export default function Login() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.push('/dashboard')
      }
    })

    if (router.query.error) {
      setError('Authentication failed. Please ensure you are using your @hylur.net email.')
    }
  }, [router])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const result = await signIn('google', {
        callbackUrl: router.query.callbackUrl || '/dashboard',
        redirect: false
      })

      if (result?.error) {
        setError('Authentication failed. Please ensure you are using your @hylur.net email.')
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Login - Hylur BESS Platform</title>
        <meta name="description" content="Sign in to Hylur Battery Energy Storage Systems platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{
          maxWidth: '400px',
          width: '100%',
          background: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}>
          {/* Hylur Logo and Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              margin: '0 auto 1rem',
              height: '4rem',
              width: '4rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>H</span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a202c', margin: 0 }}>
              Welcome to Hylur
            </h2>
            <p style={{ marginTop: '0.5rem', color: '#718096' }}>
              Battery Energy Storage Systems Platform
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              background: '#fed7d7',
              border: '1px solid #feb2b2',
              borderRadius: '0.5rem'
            }}>
              <p style={{ color: '#c53030', fontSize: '0.875rem', margin: 0 }}>{error}</p>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.75rem 1rem',
              border: '1px solid #d2d6dc',
              borderRadius: '0.5rem',
              background: 'white',
              color: '#374151',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1,
              transition: 'all 0.2s',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            {isLoading ? (
              <div style={{
                width: '1.25rem',
                height: '1.25rem',
                border: '2px solid #667eea',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            ) : (
              <>
                <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.75rem' }} viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google Workspace
              </>
            )}
          </button>

          {/* Domain Notice */}
          <p style={{ marginTop: '1rem', fontSize: '0.75rem', textAlign: 'center', color: '#9ca3af' }}>
            Only @hylur.net email addresses are allowed
          </p>

          {/* Features Preview */}
          <div style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
              <div style={{ width: '0.5rem', height: '0.5rem', background: '#10b981', borderRadius: '50%', marginRight: '0.75rem' }}></div>
              Real-time BESS monitoring
            </div>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
              <div style={{ width: '0.5rem', height: '0.5rem', background: '#3b82f6', borderRadius: '50%', marginRight: '0.75rem' }}></div>
              AI-powered analytics
            </div>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
              <div style={{ width: '0.5rem', height: '0.5rem', background: '#8b5cf6', borderRadius: '50%', marginRight: '0.75rem' }}></div>
              Document management
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  
  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    }
  }

  return { props: {} }
}
