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
