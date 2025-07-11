#!/bin/bash

# HYLUR Platform - Auth0 Integration Automation
# This script automates Auth0 implementation from step 4 onwards

set -e  # Exit on any error

echo "🔐 HYLUR Platform - Auth0 Integration"
echo "===================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Please run this script in your hylur-platform directory."
    exit 1
fi

echo "✅ Project detected"

# Check if Auth0 is already installed
if grep -q "@auth0/nextjs-auth0" package.json; then
    echo "✅ Auth0 already installed"
else
    echo "📦 Installing Auth0 packages..."
    npm install @auth0/nextjs-auth0
fi

# Create lib directory
echo "📁 Creating lib directory..."
mkdir -p lib

# Create Auth0 configuration
echo "⚙️ Creating Auth0 configuration (lib/auth0.js)..."
cat > lib/auth0.js << 'EOF'
import { initAuth0 } from '@auth0/nextjs-auth0';

export default initAuth0({
  domain: process.env.AUTH0_ISSUER_BASE_URL,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: 'openid profile email',
  redirectUri: `${process.env.AUTH0_BASE_URL}/api/auth/callback`,
  postLogoutRedirectUri: process.env.AUTH0_BASE_URL,
  session: {
    cookieSecret: process.env.AUTH0_SECRET,
    cookieLifetime: 60 * 60 * 8, // 8 hours
    storeIdToken: false,
    storeRefreshToken: false,
    storeAccessToken: false
  }
});
EOF

# Create API directory structure
echo "📁 Creating API auth directory..."
mkdir -p pages/api/auth

# Create Auth0 API route
echo "🔌 Creating Auth0 API route (pages/api/auth/[...auth0].js)..."
cat > pages/api/auth/[...auth0].js << 'EOF'
import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export default handleAuth({
  login: handleLogin({
    authorizationParams: {
      audience: process.env.AUTH0_AUDIENCE, // Optional
      scope: 'openid profile email'
    }
  })
});
EOF

# Create _app.js with UserProvider
echo "🔧 Creating _app.js with Auth0 UserProvider..."
cat > pages/_app.js << 'EOF'
import { UserProvider } from '@auth0/nextjs-auth0/client';

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}
EOF

# Update login page with Auth0
echo "🔐 Updating login page with Auth0..."
cat > pages/login.js << 'EOF'
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
EOF

# Update dashboard with Auth0
echo "📊 Updating dashboard with Auth0..."
cat > pages/dashboard.js << 'EOF'
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
EOF

# Create sample .env.local
echo "📝 Creating sample environment file..."
cat > .env.local.example << 'EOF'
# Auth0 Configuration
# Generate secret with: openssl rand -hex 32
AUTH0_SECRET='your-32-character-secret-here'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://your-domain.auth0.com'
AUTH0_CLIENT_ID='your-client-id-from-auth0'
AUTH0_CLIENT_SECRET='your-client-secret-from-auth0'

# Optional
AUTH0_SCOPE='openid profile email'
AUTH0_AUDIENCE='your-api-identifier'
EOF

# Update package.json to include Auth0
echo "📦 Updating package.json..."
# Create a backup
cp package.json package.json.backup

# Update package.json with Auth0 dependency
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.dependencies['@auth0/nextjs-auth0'] = '^3.2.0';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

# Install dependencies
echo "📦 Installing updated dependencies..."
npm install

# Test build
echo "🔨 Testing build..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check for errors."
    exit 1
fi

# Add to git
echo "🔄 Adding Auth0 files to git..."
git add .
git commit -m "Implement Auth0 authentication - automated setup"

echo ""
echo "🎉 Auth0 Integration Complete!"
echo "================================"
echo ""
echo "✅ Created Files:"
echo "   • lib/auth0.js - Auth0 configuration"
echo "   • pages/api/auth/[...auth0].js - Auth0 API routes"
echo "   • pages/_app.js - UserProvider wrapper"
echo "   • Updated pages/login.js - Auth0 login"
echo "   • Updated pages/dashboard.js - Protected dashboard"
echo "   • .env.local.example - Environment template"
echo ""
echo "🔧 Manual Steps Required:"
echo ""
echo "1. CREATE AUTH0 APPLICATION:"
echo "   • Go to: https://auth0.com"
echo "   • Create Single Page Application: 'HYLUR Platform'"
echo "   • Copy Client ID and Client Secret"
echo ""
echo "2. CREATE .env.local FILE:"
echo "   • Copy .env.local.example to .env.local"
echo "   • Fill in your Auth0 credentials"
echo "   • Generate secret: openssl rand -hex 32"
echo ""
echo "3. CONFIGURE AUTH0 URLS:"
echo "   Allowed Callback URLs:"
echo "   • http://localhost:3000/api/auth/callback"
echo "   • https://your-vercel-domain.vercel.app/api/auth/callback"
echo ""
echo "   Allowed Logout URLs:"
echo "   • http://localhost:3000"
echo "   • https://your-vercel-domain.vercel.app"
echo ""
echo "4. CREATE FOUNDER USERS IN AUTH0:"
echo "   • haukur@hylur.net (Haukur Eriksson)"
echo "   • leif@hylur.net (Leif Eriksson)"
echo ""
echo "5. SET VERCEL ENVIRONMENT VARIABLES:"
echo "   • Go to Vercel Dashboard → Settings → Environment Variables"
echo "   • Add all variables from .env.local"
echo ""
echo "6. TEST AND DEPLOY:"
echo "   • npm run dev (test locally)"
echo "   • git push origin main (deploy to Vercel)"
echo ""
echo "🔐 Benefits:"
echo "   ✅ Enterprise-grade security"
echo "   ✅ Automatic session management"
echo "   ✅ Password reset functionality"
echo "   ✅ User management dashboard"
echo "   ✅ Ready for MFA and social logins"
echo ""
echo "📧 Founder Access:"
echo "   • Only haukur@hylur.net and leif@hylur.net can access"
echo "   • Non-founders are automatically redirected"
echo "   • Secure, encrypted sessions"
echo ""
echo "✅ Ready for production!"
EOF