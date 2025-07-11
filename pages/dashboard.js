import Head from 'next/head';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';

function Dashboard() {
  const { user, error, isLoading } = useUser();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Inter, sans-serif'
      }}>
        Loading dashboard...
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

  const isHaukur = user?.email === 'haukur@hylur.net';
  const firstName = isHaukur ? 'Haukur' : 'Leif';
  const initials = isHaukur ? 'HE' : 'LE';
  const role = isHaukur ? 'Partnership & Strategy Lead' : 'Energy & Technology Lead';

  return (
    <>
      <Head>
        <title>HYLUR - Partnership Dashboard</title>
        <meta name="description" content="HYLUR Document Management Platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <style jsx global>{`
        :root {
            --primary-navy: #2c3e50;
            --wave-teal: #48c9b0;
            --wave-blue: #5dade2;
            --background-light: #f8f9fa;
            --text-dark: #2c3e50;
            --text-light: #7f8c8d;
            --white: #ffffff;
            --border-light: #e9ecef;
            --error-red: #e74c3c;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: var(--background-light);
            color: var(--text-dark);
            line-height: 1.6;
        }

        .header {
            background: var(--white);
            border-bottom: 1px solid var(--border-light);
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .menu-toggle {
            background: none;
            border: none;
            font-size: 1.2rem;
            color: var(--text-dark);
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 8px;
        }

        .header-logo {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.2rem;
            font-weight: 700;
            color: var(--text-dark);
        }

        .header-logo-icon {
            width: 32px;
            height: 32px;
            background: var(--primary-navy);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            color: white;
        }

        .user-info {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .user-avatar {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, var(--wave-teal), var(--wave-blue));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 0.9rem;
        }

        .user-details h4 {
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--text-dark);
        }

        .user-details p {
            font-size: 0.8rem;
            color: var(--text-light);
        }

        .logout-btn {
            background: none;
            border: 1px solid var(--border-light);
            color: var(--text-light);
            padding: 0.5rem 1rem;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.2s ease;
            text-decoration: none;
        }

        .logout-btn:hover {
            background: var(--error-red);
            color: white;
            border-color: var(--error-red);
        }

        .main-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }

        .welcome-section {
            background: var(--white);
            border-radius: 16px;
            padding: 2rem;
            border: 1px solid var(--border-light);
            margin-bottom: 2rem;
            position: relative;
            overflow: hidden;
        }

        .welcome-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--wave-blue), var(--wave-teal));
        }

        .welcome-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--text-dark);
            margin-bottom: 0.5rem;
        }

        .welcome-subtitle {
            color: var(--text-light);
            font-size: 1rem;
        }

        .role-badge {
            background: linear-gradient(135deg, var(--wave-teal), var(--wave-blue));
            color: white;
            padding: 0.3rem 1rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            display: inline-block;
            margin-top: 1rem;
        }

        .auth-info {
            background: var(--white);
            border-radius: 16px;
            padding: 2rem;
            border: 1px solid var(--border-light);
            margin-bottom: 2rem;
        }

        .auth-info h3 {
            color: var(--text-dark);
            margin-bottom: 1rem;
        }

        .auth-info p {
            color: var(--text-light);
            margin-bottom: 0.5rem;
        }

        .coming-soon {
            background: var(--white);
            border-radius: 16px;
            padding: 3rem;
            border: 1px solid var(--border-light);
            text-align: center;
        }

        .coming-soon h3 {
            font-size: 1.5rem;
            color: var(--text-dark);
            margin-bottom: 1rem;
        }

        .coming-soon p {
            color: var(--text-light);
            font-size: 1.1rem;
        }

        @media (max-width: 768px) {
            .header {
                padding: 1rem;
            }
            .user-details {
                display: none;
            }
            .main-content {
                padding: 1rem;
            }
        }
      `}</style>

      <header className="header">
        <div className="header-left">
          <button className="menu-toggle">☰</button>
          <div className="header-logo">
            <div className="header-logo-icon">⚡</div>
            HYLUR
          </div>
        </div>
        
        <div className="user-info">
          <div className="user-avatar">{initials}</div>
          <div className="user-details">
            <h4>{user?.name || firstName}</h4>
            <p>{role}</p>
          </div>
          <a href="/api/auth/logout" className="logout-btn">Logout</a>
        </div>
      </header>

      <main className="main-content">
        <div className="welcome-section">
          <h1 className="welcome-title">Welcome back, {firstName}!</h1>
          <p className="welcome-subtitle">Your secure partnership dashboard</p>
          <div className="role-badge">{role}</div>
        </div>

        <div className="auth-info">
          <h3>🔐 Auth0 Integration Active</h3>
          <p><strong>Logged in as:</strong> {user?.email}</p>
          <p><strong>Name:</strong> {user?.name || firstName}</p>
          <p><strong>Auth Provider:</strong> Auth0</p>
          <p><strong>Session:</strong> Secure & Encrypted</p>
        </div>

        <div className="coming-soon">
          <h3>📊 Dashboard Coming Soon</h3>
          <p>Document management and AI analysis features are being developed. Your secure authentication is ready!</p>
        </div>
      </main>
    </>
  );
}

// Protect the dashboard route - requires authentication
export default withPageAuthRequired(Dashboard);
