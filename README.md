# 🔋 Hylur BESS Platform

Advanced Battery Energy Storage Systems platform with document management and AI analysis capabilities.

**Founded by Energy Experts:**
- **Haukur** (CEO) - 8+ years energy sector business development, former BD manager at Nordic utility
- **Leif** (COO) - Mechatronics engineer specializing in energy systems & AI implementation

## 🚀 Quick Start

### Automated Setup (Recommended)

```bash
curl -fsSL https://raw.githubusercontent.com/leifhalldor-hylur/hylur-platform/main/setup.sh | bash
```

### Manual Setup

1. **Clone Repository**
```bash
git clone https://github.com/leifhalldor-hylur/hylur-platform.git
cd hylur-platform
```

2. **Install Dependencies**
```bash
npm install
```

3. **Set up Environment**
```bash
cp .env.example .env.local
# Edit .env.local with your Google OAuth credentials
```

4. **Initialize Database**
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

5. **Start Development**
```bash
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

**Built with ⚡ by the HYLUR team for the future of energy storage**

*Empowering the renewable energy transition through intelligent battery management systems*
