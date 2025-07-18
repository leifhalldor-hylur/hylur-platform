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
```

## 👥 Founders & Authentication

### Automatic Role Assignment
- `haukur@hylur.net` → **CEO** (Business Leadership)
- `leif@hylur.net` → **COO** (Technical Operations)
- Other `@hylur.net` → **GUEST** (Future team members)
- External domains → **CLIENT_USER/CLIENT_ADMIN**

### Role Permissions

**CEO (Haukur - Business Development)**
- Executive oversight & strategic planning
- Client relationship management
- Business analytics & financial reporting
- Sales & partnership management
- User management & system configuration

**COO (Leif - Mechatronics Engineer)**
- Technical operations & system maintenance
- AI analysis management & diagnostics
- Energy system analytics & monitoring
- Integration management & documentation
- System configuration & user management

## 🏗️ Architecture

```
hylur-platform/
├── pages/
│   ├── api/
│   │   ├── auth/[...nextauth].js    # Google Workspace authentication
│   │   └── facilities/              # BESS facility management APIs
│   ├── login.js                     # Professional login interface
│   ├── dashboard.js                 # Founder-specific dashboards
│   └── index.js                     # Landing page
├── lib/
│   └── auth.js                      # Authentication utilities & permissions
├── prisma/
│   ├── schema.prisma                # Database schema for BESS platform
│   └── seed.js                      # Sample BESS facility data
├── middleware.js                    # Route protection & role-based access
└── .env.local                       # Environment configuration
```

## 🔐 Security Features

- **Domain Restriction**: Only `@hylur.net` emails allowed
- **Role-Based Access Control**: Founder-specific permissions
- **Route Protection**: Middleware-based authorization
- **Session Management**: Secure database sessions
- **Google Workspace Integration**: Enterprise-grade authentication

## 🔋 BESS Platform Features

- **Real-time Monitoring**: Battery system status and performance metrics
- **AI-Powered Analytics**: Predictive maintenance and optimization algorithms
- **Document Management**: Centralized BESS documentation and compliance
- **Multi-tenant Support**: Client organization management
- **Facility Management**: Multiple BESS site handling and monitoring
- **Performance Tracking**: Efficiency metrics and historical data

## 🛠️ Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run database migrations
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed sample BESS data
npm run setup:complete   # Complete database setup
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
```bash
npx vercel
```

2. **Environment Variables**
```env
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-32-char-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
DATABASE_URL=your-production-database-url
```

3. **Deploy**
```bash
npx vercel --prod
```

## 🗄️ Database Configuration

### Development (SQLite)
- Automatically configured with sample BESS data
- Database file: `prisma/dev.db`

### Production (PostgreSQL)
```bash
# Example production database URL
DATABASE_URL="postgresql://username:password@host:5432/hylur_bess"
```

## 🔧 Google OAuth Setup

1. **Google Cloud Console**: https://console.cloud.google.com/
2. **Enable APIs**: Google+ API and Google Identity APIs
3. **Create OAuth Credentials**:
   - Application type: Web application
   - Authorized origins: `http://localhost:3000`, `https://your-domain.vercel.app`
   - Redirect URIs: `/api/auth/callback/google`
4. **Update Environment**: Add client ID and secret to `.env.local`

## 📊 Dashboard Features

### CEO Dashboard (Haukur)
- Executive metrics: Revenue, clients, pipeline
- Strategic planning tools
- Business analytics and reporting
- Partnership management interface

### COO Dashboard (Leif)
- Technical metrics: System efficiency, facility status
- AI model monitoring
- Diagnostic tools and alerts
- Integration management

## 🔄 Development Workflow

1. **Feature Development**
```bash
git checkout -b feature/new-bess-feature
npm run dev  # Develop with hot reloading
```

2. **Testing**
```bash
npm run build  # Ensure build success
npm run lint   # Code quality check
```

3. **Database Changes**
```bash
npx prisma migrate dev --name feature-name
```

4. **Deployment**
```bash
git push origin feature/new-bess-feature
# Create pull request for review
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing BESS feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - Open source for the renewable energy future

## 🆘 Support & Contact

**Technical Issues (Leif - COO):**
- Email: leif@hylur.net
- Focus: System architecture, AI implementation, technical diagnostics

**Business Inquiries (Haukur - CEO):**
- Email: haukur@hylur.net  
- Focus: Partnerships, client relationships, strategic planning

## 🌟 Technology Stack

- **Frontend**: Next.js 14, React 18
- **Authentication**: NextAuth.js with Google Workspace
- **Database**: Prisma ORM with SQLite/PostgreSQL
- **Deployment**: Vercel with automatic CI/CD
- **Styling**: Inline styles (production-ready)

---

**Built with ⚡ by the HYLUR team for the future of energy storage**

*Empowering the renewable energy transition through intelligent battery management systems*
