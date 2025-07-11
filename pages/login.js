import Head from 'next/head';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Login() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // Check if user is a founder
      const founderEmails = ['haukur@hylur.net', 'leif@hylur.net'];
      
      if (founderEmails.includes(user.email)) {
        router.push('/dashboard');
      } else {
        // Redirect non-founders - they shouldn't have access
        alert('Access denied. This portal is for HYLUR founders only.');
        router.push('/api/auth/logout');
      }
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Inter, sans-serif'
      }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Inter, sans-serif'
      }}>
        Error: {error.message}
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>HYLUR - Login</title>
        <meta name="description" content="HYLUR Founder Access Portal" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <style jsx global>{`
        :root {
            --primary-navy: #2c3e50;
            --wave-teal: #48c9b0;
            --wave-blue: #5dade2;
            --wave-green: #58d68d;
            --text-dark: #2c3e50;
            --text-light: #7f8c8d;
            --white: #ffffff;
            --border-light: #e9ecef;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, var(--primary-navy) 0%, #34495e 50%, #3498db 100%);
            color: var(--text-dark);
            line-height: 1.6;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }

        .login-container {
            background: var(--white);
            border-radius: 20px;
            padding: 3rem;
            max-width: 400px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            position: relative;
            overflow: hidden;
            text-align: center;
        }

        .login-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--wave-blue), var(--wave-teal), var(--wave-green));
        }

        .logo-container {
            background: #f5f5f0;
            border: 3px solid var(--primary-navy);
            border-radius: 20px;
            padding: 1rem 1.5rem;
            display: inline-flex;
            align-items: center;
            gap: 0.8rem;
            position: relative;
            overflow: hidden;
            margin-bottom: 1rem;
        }

        .logo-icon {
            width: 40px;
            height: 40px;
            background: var(--primary-navy);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 3;
        }

        .logo-icon::after {
            content: '⚡';
            font-size: 1.4rem;
            color: white;
        }

        .logo-text {
            font-size: 1.8rem;
            font-weight: 800;
            color: var(--primary-navy);
            z-index: 3;
            position: relative;
        }

        .logo-waves {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 15px;
            background: linear-gradient(90deg, var(--wave-blue), var(--wave-teal), var(--wave-green));
            clip-path: polygon(0% 30%, 10% 70%, 20% 30%, 30% 70%, 40% 30%, 50% 70%, 60% 30%, 70% 70%, 80% 30%, 90% 70%, 100% 30%, 100% 100%, 0% 100%);
        }

        .founder-badge {
            background: linear-gradient(135deg, var(--wave-blue), var(--wave-teal));
            color: white;
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 2rem;
        }

        .login-title {
            font-size: 1.6rem;
            font-weight: 600;
            color: var(--text-dark);
            margin-bottom: 0.5rem;
        }

        .login-subtitle {
            color: var(--text-light);
            font-size: 0.95rem;
            margin-bottom: 2rem;
        }

        .auth0-btn {
            background: linear-gradient(135deg, var(--wave-teal), var(--wave-blue));
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
            width: 100%;
            margin-bottom: 2rem;
        }

        .auth0-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 8px 25px rgba(72, 201, 176, 0.3);
        }

        .back-home {
            color: var(--text-light);
            text-decoration: none;
            font-size: 0.9rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border-light);
            display: block;
        }

        .back-home:hover {
            color: var(--wave-teal);
        }

        @media (max-width: 480px) {
            .login-container {
                padding: 2rem 1.5rem;
                margin: 1rem;
            }
        }
      `}</style>

      <div className="login-container">
        <div className="logo-container">
          <div className="logo-icon"></div>
          <div className="logo-text">HYLUR</div>
          <div className="logo-waves"></div>
        </div>
        <div className="founder-badge">Founder Access</div>

        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Secure authentication powered by Auth0</p>

        <a href="/api/auth/login" className="auth0-btn">
          Sign In to HYLUR Platform
        </a>

        <a href="/" className="back-home">← Back to Homepage</a>
      </div>
    </>
  );
}
