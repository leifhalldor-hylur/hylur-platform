#!/bin/bash

# HYLUR Platform - Fully Automated Setup
# This script creates your complete Next.js project automatically

set -e  # Exit on any error

echo "🚀 HYLUR Platform - Automated Setup"
echo "===================================="
echo "Repository: https://github.com/leifhalldor-hylur/hylur-platform.git"
echo ""

# Check if we're in the right directory
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository!"
    echo "Please run this script in your cloned hylur-platform directory."
    echo ""
    echo "First run:"
    echo "git clone https://github.com/leifhalldor-hylur/hylur-platform.git"
    echo "cd hylur-platform"
    echo "Then run this script again."
    exit 1
fi

echo "✅ Git repository detected"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Create directory structure
echo "📁 Creating project structure..."
mkdir -p pages public

# Create package.json
echo "📦 Creating package.json..."
cat > package.json << 'EOF'
{
  "name": "hylur-platform",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.0.4",
    "typescript": "^5"
  }
}
EOF

# Create next.config.js
echo "⚙️ Creating next.config.js..."
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
EOF

# Create .gitignore
echo "🙈 Creating .gitignore..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.log

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
EOF

# Create homepage (pages/index.js)
echo "🏠 Creating homepage (pages/index.js)..."
cat > pages/index.js << 'EOF'
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>HYLUR - Powering the Energy Future</title>
        <meta name="description" content="Advanced Battery Energy Storage Systems through innovative Public-Private Partnerships" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <style jsx global>{`
        :root {
            --primary-navy: #2c3e50;
            --primary-blue: #3498db;
            --wave-blue: #5dade2;
            --wave-teal: #48c9b0;
            --wave-green: #58d68d;
            --background-light: #f8f9fa;
            --text-dark: #2c3e50;
            --text-light: #7f8c8d;
            --text-lighter: #a0a0a0;
            --white: #ffffff;
            --border-light: #e9ecef;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
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
            transition: background-color 0.2s ease;
        }

        .menu-toggle:hover {
            background: var(--background-light);
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

        .login-btn {
            background: linear-gradient(135deg, var(--wave-teal), var(--wave-blue));
            color: white;
            padding: 0.6rem 1.5rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .login-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(72, 201, 176, 0.3);
        }

        .main-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 3rem 2rem;
        }

        .welcome-section {
            margin-bottom: 3rem;
        }

        .welcome-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--text-dark);
            margin-bottom: 0.5rem;
        }

        .welcome-subtitle {
            font-size: 1.1rem;
            color: var(--text-light);
            margin-bottom: 2rem;
        }

        .search-container {
            position: relative;
            margin-bottom: 3rem;
        }

        .search-input {
            width: 100%;
            max-width: 600px;
            padding: 1rem 1rem 1rem 3rem;
            border: 2px solid var(--border-light);
            border-radius: 12px;
            font-size: 1rem;
            background: var(--white);
            transition: all 0.3s ease;
        }

        .search-input:focus {
            outline: none;
            border-color: var(--wave-teal);
            box-shadow: 0 0 0 3px rgba(72, 201, 176, 0.1);
        }

        .search-icon {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-light);
            font-size: 1.1rem;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }

        .stat-card {
            background: var(--white);
            border-radius: 16px;
            padding: 2rem;
            border: 1px solid var(--border-light);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--wave-blue), var(--wave-teal), var(--wave-green));
        }

        .stat-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
        }

        .stat-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: white;
        }

        .stat-icon.energy {
            background: linear-gradient(135deg, var(--primary-blue), var(--wave-blue));
        }

        .stat-icon.partnership {
            background: linear-gradient(135deg, var(--wave-teal), var(--wave-green));
        }

        .stat-icon.renewable {
            background: linear-gradient(135deg, #8e44ad, #9b59b6);
        }

        .stat-number {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--text-dark);
            line-height: 1;
            margin-bottom: 0.5rem;
        }

        .stat-label {
            font-size: 1rem;
            color: var(--text-light);
            font-weight: 500;
        }

        .services-section {
            background: var(--white);
            border-radius: 16px;
            padding: 2rem;
            border: 1px solid var(--border-light);
        }

        .services-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: var(--text-dark);
            margin-bottom: 1.5rem;
        }

        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }

        .service-btn {
            background: var(--background-light);
            border: 1px solid var(--border-light);
            border-radius: 12px;
            padding: 1rem 1.5rem;
            text-align: center;
            text-decoration: none;
            color: var(--text-dark);
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .service-btn:hover {
            background: var(--wave-teal);
            color: white;
            transform: translateY(-1px);
        }

        @media (max-width: 768px) {
            .header {
                padding: 1rem;
            }

            .main-content {
                padding: 2rem 1rem;
            }

            .welcome-title {
                font-size: 2rem;
            }

            .stats-grid {
                grid-template-columns: 1fr;
            }

            .services-grid {
                grid-template-columns: 1fr;
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
        
        <div>
          <a href="/login" className="login-btn">Login</a>
        </div>
      </header>

      <main className="main-content">
        <div className="welcome-section">
          <h1 className="welcome-title">Powering the Energy Future</h1>
          <p className="welcome-subtitle">Advanced Battery Energy Storage Systems through innovative Public-Private Partnerships</p>
        </div>

        <div className="search-container">
          <div className="search-icon">🔍</div>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search our services, projects, and expertise..."
          />
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon energy">⚡</div>
            </div>
            <div className="stat-number">6.5</div>
            <div className="stat-label">MW Project Capacity</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon partnership">🤝</div>
            </div>
            <div className="stat-number">25</div>
            <div className="stat-label">Year Partnerships</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon renewable">🌍</div>
            </div>
            <div className="stat-number">100</div>
            <div className="stat-label">% Renewable Focus</div>
          </div>
        </div>

        <div className="services-section">
          <h3 className="services-title">Our Expertise</h3>
          <div className="services-grid">
            <a href="#" className="service-btn">BESS Development</a>
            <a href="#" className="service-btn">PPP Structuring</a>
            <a href="#" className="service-btn">Revenue Optimization</a>
            <a href="#" className="service-btn">Grid Services</a>
            <a href="#" className="service-btn">Project Finance</a>
            <a href="/login" className="service-btn">Partner Portal</a>
          </div>
        </div>
      </main>
    </>
  );
}
EOF

# Create login page (pages/login.js)
echo "🔐 Creating login page (pages/login.js)..."
cat > pages/login.js << 'EOF'
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const FOUNDER_CREDENTIALS = {
    'haukur@hylur.net': 'PPP2025!Strategy#Partnership',
    'leif@hylur.net': 'BESS2025!Energy#Technology'
  };

  useEffect(() => {
    const existingUser = localStorage.getItem('hylur_user');
    if (existingUser) {
      const userData = JSON.parse(existingUser);
      const loginTime = new Date(userData.loginTime);
      const now = new Date();
      const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
      
      if (hoursSinceLogin < 24) {
        router.push('/dashboard');
      } else {
        localStorage.removeItem('hylur_user');
      }
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    const formData = new FormData(e.target);
    const email = formData.get('email').trim();
    const password = formData.get('password');
    
    let newErrors = {};
    
    if (!email || !email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (FOUNDER_CREDENTIALS[email] && FOUNDER_CREDENTIALS[email] === password) {
      setShowSuccess(true);
      
      localStorage.setItem('hylur_user', JSON.stringify({
        email: email,
        name: email === 'haukur@hylur.net' ? 'Haukur Eriksson' : 'Leif Eriksson',
        role: email === 'haukur@hylur.net' ? 'Partnership & Strategy Lead' : 'Energy & Technology Lead',
        loginTime: new Date().toISOString()
      }));
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } else {
      if (!FOUNDER_CREDENTIALS[email]) {
        setErrors({ email: 'Email not found in founder registry' });
      } else {
        setErrors({ password: 'Incorrect password' });
      }
      
      setIsLoading(false);
    }
  };

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
            --error-red: #e74c3c;
            --success-green: #27ae60;
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

        .login-logo {
            text-align: center;
            margin-bottom: 2rem;
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
            display: inline-block;
            margin-top: 0.5rem;
        }

        .login-header {
            text-align: center;
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
        }

        .login-form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .form-group {
            position: relative;
        }

        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: var(--text-dark);
            font-size: 0.9rem;
        }

        .form-input {
            width: 100%;
            padding: 1rem;
            border: 2px solid var(--border-light);
            border-radius: 12px;
            font-size: 1rem;
            background: var(--white);
            transition: all 0.3s ease;
        }

        .form-input:focus {
            outline: none;
            border-color: var(--wave-teal);
            box-shadow: 0 0 0 3px rgba(72, 201, 176, 0.1);
        }

        .form-input.error {
            border-color: var(--error-red);
            box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
        }

        .error-message {
            color: var(--error-red);
            font-size: 0.85rem;
            margin-top: 0.5rem;
        }

        .form-options {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0.5rem 0;
        }

        .remember-me {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--text-light);
            font-size: 0.9rem;
        }

        .remember-me input[type="checkbox"] {
            accent-color: var(--wave-teal);
        }

        .forgot-password {
            color: var(--wave-teal);
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
        }

        .forgot-password:hover {
            text-decoration: underline;
        }

        .login-btn {
            background: linear-gradient(135deg, var(--wave-teal), var(--wave-blue));
            color: white;
            padding: 1rem;
            border: none;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }

        .login-btn:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 8px 25px rgba(72, 201, 176, 0.3);
        }

        .login-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .btn-spinner {
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .login-footer {
            text-align: center;
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border-light);
        }

        .back-home {
            color: var(--text-light);
            text-decoration: none;
            font-size: 0.9rem;
        }

        .back-home:hover {
            color: var(--wave-teal);
        }

        .success-message {
            background: var(--success-green);
            color: white;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            text-align: center;
        }

        @media (max-width: 480px) {
            .login-container {
                padding: 2rem 1.5rem;
                margin: 1rem;
            }
        }
      `}</style>

      <div className="login-container">
        <div className="login-logo">
          <div className="logo-container">
            <div className="logo-icon"></div>
            <div className="logo-text">HYLUR</div>
            <div className="logo-waves"></div>
          </div>
          <div className="founder-badge">Founder Access</div>
        </div>

        <div className="login-header">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to access your partnership portal</p>
        </div>

        {showSuccess && (
          <div className="success-message">
            Login successful! Redirecting to dashboard...
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email"
              required
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Enter your password"
              required
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading && <div className="btn-spinner"></div>}
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="login-footer">
          <a href="/" className="back-home">← Back to Homepage</a>
        </div>
      </div>
    </>
  );
}
EOF

# Create dashboard (pages/dashboard.js)
echo "📊 Creating dashboard (pages/dashboard.js)..."
cat > pages/dashboard.js << 'EOF'
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('hylur_user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);
    setCurrentUser(user);
  }, [router]);

  const logout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('hylur_user');
      router.push('/login');
    }
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const isHaukur = currentUser.email === 'haukur@hylur.net';
  const firstName = isHaukur ? 'Haukur' : 'Leif';
  const initials = isHaukur ? 'HE' : 'LE';

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
            <h4>{currentUser.name}</h4>
            <p>{currentUser.role}</p>
          </div>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="main-content">
        <div className="welcome-section">
          <h1 className="welcome-title">Welcome back, {firstName}!</h1>
          <p className="welcome-subtitle">Your partnership dashboard</p>
          <div className="role-badge">{currentUser.role}</div>
        </div>

        <div className="coming-soon">
          <h3>📊 Dashboard Coming Soon</h3>
          <p>Document management and AI analysis features are being developed. Stay tuned for the full platform!</p>
        </div>
      </main>
    </>
  );
}
EOF

# Create README
echo "📝 Creating README.md..."
cat > README.md << 'EOF'
# HYLUR Platform

Advanced Battery Energy Storage Systems platform with document management and AI analysis capabilities.

## 🚀 Quick Start

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## 🔐 Founder Login

- **Haukur:** haukur@hylur.net / PPP2025!Strategy#Partnership  
- **Leif:** leif@hylur.net / BESS2025!Energy#Technology

## 📁 Structure

- `pages/index.js` - Homepage
- `pages/login.js` - Founder authentication  
- `pages/dashboard.js` - Dashboard (basic version)

## 🌐 Deployment

1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

**Built with ⚡ by the HYLUR team**
EOF

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Test the build
echo "🔨 Testing build..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check the logs."
    exit 1
fi

# Add to git
echo "🔄 Adding files to git..."
git add .
git commit -m "Automated HYLUR platform setup - Complete Next.js project"

echo ""
echo "🎉 HYLUR Platform Setup Complete!"
echo "===================================="
echo ""
echo "📁 Project ready in: $(pwd)"
echo ""
echo "🚀 Next Steps:"
echo "1. Test locally:     npm run dev"
echo "2. Push to GitHub:   git push origin main"
echo "3. Deploy on Vercel: Import your GitHub repo at vercel.com"
echo ""
echo "🔐 Founder Login Credentials:"
echo "   Leif:   leif@hylur.net / BESS2025!Energy#Technology"
echo "   Haukur: haukur@hylur.net / PPP2025!Strategy#Partnership"
echo ""
echo "✅ Ready for deployment!"
EOF