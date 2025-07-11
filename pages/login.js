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
