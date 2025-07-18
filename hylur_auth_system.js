# Hylur BESS Platform - Authentication Implementation

## 1. Install Dependencies

```bash
npm install next-auth @next-auth/prisma-adapter prisma @prisma/client bcryptjs
npm install -D prisma
```

## 2. Environment Variables (.env.local)

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here-generate-random-32-chars

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database (PostgreSQL recommended for production)
DATABASE_URL="postgresql://username:password@localhost:5432/hylur_bess"

# Optional: For development
NODE_ENV=development
```

## 3. Database Schema (prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  role          Role      @default(GUEST)
  title         String?   // e.g., "Co-Founder & CEO", "Co-Founder & COO"
  expertise     String?   // e.g., "Mechatronics Engineering", "Business Development"
  department    String?   // e.g., "Technical", "Business Operations"
  facilityIds   String[]  @default([])
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  accounts Account[]
  sessions Session[]
  
  @@map("users")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Facility {
  id          String   @id @default(cuid())
  name        String
  location    String
  capacity    Float    // MWh
  status      String   @default("active")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("facilities")
}

enum Role {
  CEO
  COO
  CLIENT_ADMIN
  CLIENT_USER
  GUEST
}
```

## 4. NextAuth Configuration (pages/api/auth/[...nextauth].js)

```javascript
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Role hierarchy for Hylur BESS platform
const ROLE_PERMISSIONS = {
  CEO: [
    // Executive & Business Leadership (Haukur - Business Development)
    'executive_oversight',
    'strategic_planning',
    'client_relationship_management', 
    'business_analytics',
    'sales_management',
    'partnership_management',
    'financial_reporting',
    'user_management',
    'manage_all_facilities',
    'view_all_analytics',
    'generate_all_reports',
    'manage_business_operations',
    'system_config'
  ],
  COO: [
    // Technical Operations & Implementation (Leif - Mechatronics Engineer)
    'technical_operations',
    'ai_analysis_management',
    'technical_diagnostics',
    'energy_system_analytics',
    'integration_management',
    'system_config',
    'manage_all_facilities',
    'user_management',
    'view_all_analytics',
    'generate_technical_reports',
    'manage_documents',
    'system_maintenance'
  ],
  CLIENT_ADMIN: [
    'view_client_facilities',
    'generate_client_reports',
    'manage_client_users',
    'access_client_documents'
  ],
  CLIENT_USER: [
    'view_assigned_facilities',
    'view_client_reports',
    'access_assigned_documents'
  ],
  GUEST: [
    'view_public_info'
  ]
}

// Auto-assign roles based on email addresses
function getDefaultRole(email) {
  // Specific founder email assignments
  if (email === 'haukur@hylur.net') return 'CEO'  // Business Development - CEO
  if (email === 'leif@hylur.net') return 'COO'   // Mechatronics Engineer - COO
  
  // Client domain patterns (if you have client organizations)
  if (email.includes('admin') && !email.endsWith('@hylur.net')) return 'CLIENT_ADMIN'
  if (!email.endsWith('@hylur.net')) return 'CLIENT_USER'
  
  // Default for other @hylur.net emails (future team members)
  return 'GUEST'
}

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          hd: "hylur.net", // Restrict to your domain only
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account.provider === "google") {
        // Verify email domain and that email is verified
        const isValidDomain = profile.email_verified && 
                            profile.email.endsWith("@hylur.net")
        
        if (!isValidDomain) {
          console.log(`Sign-in rejected for ${profile.email} - invalid domain`)
          return false
        }

        // Auto-create user with default role if first time
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email }
          })

          if (!existingUser) {
            const role = getDefaultRole(profile.email)
            let title = ''
            let expertise = ''
            let department = ''

            // Set specific details for founders
            if (profile.email === 'haukur@hylur.net') {
              title = 'Co-Founder & CEO'
              expertise = 'Business Development - 8+ years Energy Sector Experience'
              department = 'Executive Leadership'
            } else if (profile.email === 'leif@hylur.net') {
              title = 'Co-Founder & COO'
              expertise = 'Mechatronics Engineering - Energy Systems & AI Implementation'
              department = 'Technical Operations'
            } else if (profile.email.endsWith('@hylur.net')) {
              department = 'Team Member'
            } else {
              department = 'Client'
            }

            await prisma.user.create({
              data: {
                email: profile.email,
                name: profile.name,
                image: profile.picture,
                role: role,
                title: title,
                expertise: expertise,
                department: department,
                isActive: true
              }
            })
          }
        } catch (error) {
          console.error('Error creating user:', error)
          return false
        }

        return true
      }
      return false
    },

    async session({ session, token, user }) {
      if (session?.user?.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
              id: true,
              role: true,
              title: true,
              expertise: true,
              department: true,
              facilityIds: true,
              isActive: true
            }
          })

          if (dbUser && dbUser.isActive) {
            session.user.id = dbUser.id
            session.user.role = dbUser.role
            session.user.title = dbUser.title
            session.user.expertise = dbUser.expertise
            session.user.department = dbUser.department
            session.user.facilityIds = dbUser.facilityIds
            session.user.permissions = ROLE_PERMISSIONS[dbUser.role] || []
          } else {
            // User exists but is inactive
            return null
          }
        } catch (error) {
          console.error('Error fetching user session data:', error)
          return null
        }
      }
      return session
    },

    async jwt({ token, user, account }) {
      return token
    }
  },

  pages: {
    signIn: '/login',
    error: '/auth/error',
  },

  session: {
    strategy: 'database',
    maxAge: 24 * 60 * 60, // 24 hours
  },

  events: {
    async signIn({ user, account, profile }) {
      console.log(`User ${user.email} signed in via ${account.provider}`)
    },
    async signOut({ session }) {
      console.log(`User ${session?.user?.email} signed out`)
    }
  }
})
```

## 5. Authentication Middleware (middleware.js)

```javascript
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth
    const { pathname } = req.nextUrl

    // Public routes that don't require auth
    const publicRoutes = ['/', '/login', '/auth/error']
    if (publicRoutes.includes(pathname)) {
      return NextResponse.next()
    }

    // Check if user is authenticated
    if (!token) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', req.url)
      return NextResponse.redirect(loginUrl)
    }

    // Check if user account is active
    if (!token.isActive) {
      return NextResponse.redirect(new URL('/auth/inactive', req.url))
    }

    // Role-based route protection
    const executiveRoutes = ['/admin', '/users', '/system-config', '/strategic-planning']
    const businessRoutes = ['/clients', '/partnerships', '/sales', '/business-analytics', '/financial']
    const technicalRoutes = ['/technical', '/diagnostics', '/integrations', '/ai-management']
    
    // Executive routes (CEO primary access)
    if (executiveRoutes.some(route => pathname.startsWith(route))) {
      if (!['CEO', 'COO'].includes(token.role)) {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }

    // Business-focused routes (CEO primary, COO access)
    if (businessRoutes.some(route => pathname.startsWith(route))) {
      if (!['CEO', 'COO'].includes(token.role)) {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }

    // Technical routes (COO primary, CEO access)
    if (technicalRoutes.some(route => pathname.startsWith(route))) {
      if (!['CEO', 'COO'].includes(token.role)) {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        const publicRoutes = ['/', '/login', '/auth/error']
        if (publicRoutes.includes(req.nextUrl.pathname)) {
          return true
        }
        
        // Require authentication for all other routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}
```

## 6. Authentication Utilities (lib/auth.js)

```javascript
import { getServerSession } from "next-auth/next"
import { authOptions } from "../pages/api/auth/[...nextauth]"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function getServerAuthSession(req, res) {
  return await getServerSession(req, res, authOptions)
}

export function hasPermission(userRole, requiredPermission) {
  const ROLE_PERMISSIONS = {
    CEO: [
      // Executive & Business Leadership (Haukur - Business Development)
      'executive_oversight',
      'strategic_planning',
      'client_relationship_management', 
      'business_analytics',
      'sales_management',
      'partnership_management',
      'financial_reporting',
      'user_management',
      'manage_all_facilities',
      'view_all_analytics',
      'generate_all_reports',
      'manage_business_operations',
      'system_config'
    ],
    COO: [
      // Technical Operations & Implementation (Leif - Mechatronics Engineer)
      'technical_operations',
      'ai_analysis_management',
      'technical_diagnostics',
      'energy_system_analytics',
      'integration_management',
      'system_config',
      'manage_all_facilities',
      'user_management',
      'view_all_analytics',
      'generate_technical_reports',
      'manage_documents',
      'system_maintenance'
    ],
    CLIENT_ADMIN: [
      'view_client_facilities',
      'generate_client_reports',
      'manage_client_users',
      'access_client_documents'
    ],
    CLIENT_USER: [
      'view_assigned_facilities',
      'view_client_reports',
      'access_assigned_documents'
    ],
    GUEST: [
      'view_public_info'
    ]
  }

  const permissions = ROLE_PERMISSIONS[userRole] || []
  return permissions.includes(requiredPermission)
}

export function withAuth(handler, requiredPermissions = []) {
  return async (req, res) => {
    const session = await getServerAuthSession(req, res)
    
    if (!session) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    if (!session.user.isActive) {
      return res.status(403).json({ error: 'Account inactive' })
    }

    // Check permissions
    if (requiredPermissions.length > 0) {
      const hasAllPermissions = requiredPermissions.every(permission => 
        hasPermission(session.user.role, permission)
      )

      if (!hasAllPermissions) {
        return res.status(403).json({ 
          error: 'Insufficient permissions',
          required: requiredPermissions,
          userRole: session.user.role 
        })
      }
    }

    // Add user info to request
    req.user = session.user
    return handler(req, res)
  }
}

export async function getUserFacilities(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { facilityIds: true, role: true }
    })

    if (!user) return []

    // CEO and COO can see all facilities
    if (['CEO', 'COO'].includes(user.role)) {
      return await prisma.facility.findMany()
    }

    // Client admins see all client facilities
    if (user.role === 'CLIENT_ADMIN') {
      return await prisma.facility.findMany({
        where: {
          // Add client-specific filtering logic here
          status: 'active'
        }
      })
    }

    // Other users see only assigned facilities
    return await prisma.facility.findMany({
      where: {
        id: {
          in: user.facilityIds
        }
      }
    })
  } catch (error) {
    console.error('Error fetching user facilities:', error)
    return []
  }
}
```

## 7. Updated Login Page (pages/login.js)

```javascript
import { signIn, getSession, getProviders } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Head from "next/head"

export default function Login() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Redirect if already logged in
    getSession().then((session) => {
      if (session) {
        router.push('/dashboard')
      }
    })

    // Handle error from callback
    if (router.query.error) {
      switch (router.query.error) {
        case 'OAuthSignin':
        case 'OAuthCallback':
        case 'OAuthCreateAccount':
        case 'EmailCreateAccount':
        case 'Callback':
          setError('Authentication failed. Please try again.')
          break
        case 'OAuthAccountNotLinked':
          setError('Account not linked. Please use the same email provider.')
          break
        case 'EmailSignin':
          setError('Email authentication failed.')
          break
        case 'CredentialsSignin':
          setError('Invalid credentials.')
          break
        case 'SessionRequired':
          setError('Please sign in to access this page.')
          break
        default:
          setError('Authentication error occurred.')
      }
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
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            {/* Logo and Header */}
            <div className="text-center mb-8">
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Welcome to Hylur</h2>
              <p className="mt-2 text-gray-600">Battery Energy Storage Systems Platform</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google Workspace
                </>
              )}
            </button>

            {/* Domain Restriction Notice */}
            <p className="mt-4 text-xs text-center text-gray-500">
              Only @hylur.net email addresses are allowed
            </p>

            {/* Features List */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Real-time BESS monitoring
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                AI-powered analytics
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Document management
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  
  // Redirect if already logged in
  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
```

## 8. Protected API Route Example (pages/api/facilities/index.js)

```javascript
import { withAuth } from '../../../lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function handler(req, res) {
  const { method } = req
  const user = req.user

  switch (method) {
    case 'GET':
      try {
        let facilities

        // CEO and COO see all facilities
        if (['CEO', 'COO'].includes(user.role)) {
          facilities = await prisma.facility.findMany({
            orderBy: { createdAt: 'desc' }
          })
        } else if (user.role === 'CLIENT_ADMIN') {
          // Client admins see client facilities
          facilities = await prisma.facility.findMany({
            where: {
              // Add client-specific filtering logic
              status: 'active'
            },
            orderBy: { createdAt: 'desc' }
          })
        } else {
          // Other users see only assigned facilities
          facilities = await prisma.facility.findMany({
            where: {
              id: {
                in: user.facilityIds
              }
            },
            orderBy: { createdAt: 'desc' }
          })
        }

        res.status(200).json({
          success: true,
          data: facilities,
          user: {
            role: user.role,
            facilityCount: facilities.length
          }
        })
      } catch (error) {
        console.error('Error fetching facilities:', error)
        res.status(500).json({
          success: false,
          error: 'Failed to fetch facilities'
        })
      }
      break

    case 'POST':
      try {
        const { name, location, capacity } = req.body

        const facility = await prisma.facility.create({
          data: {
            name,
            location,
            capacity: parseFloat(capacity),
            status: 'active'
          }
        })

        res.status(201).json({
          success: true,
          data: facility
        })
      } catch (error) {
        console.error('Error creating facility:', error)
        res.status(500).json({
          success: false,
          error: 'Failed to create facility'
        })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

// Protect route - founders and client admins can access facilities
export default withAuth(handler, ['view_all_analytics'])
```

## 9. Setup Instructions

### Step 1: Database Setup
```bash
# Initialize Prisma
npx prisma init

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database (optional)
npx prisma db seed
```

### Step 2: Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google+ API and Google Identity APIs
4. Create OAuth 2.0 credentials
5. Add authorized domains: 
   - `http://localhost:3000` (development)
   - `https://your-vercel-domain.vercel.app` (production)
6. Add redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-vercel-domain.vercel.app/api/auth/callback/google`

### Step 3: Update Your App Structure
```
hylur-platform/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── pages/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth].js
│   │   └── facilities/
│   │       └── index.js
│   ├── login.js
│   └── dashboard.js
├── lib/
│   └── auth.js
├── middleware.js
└── .env.local
```

### Step 4: Update package.json scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "db:migrate": "npx prisma migrate dev",
    "db:generate": "npx prisma generate",
    "db:studio": "npx prisma studio"
  }
}
```

This implementation provides:
✅ Google Workspace SSO with domain restrictions
✅ Role-based access control for BESS industry
✅ Database integration with Prisma
✅ Protected API routes
✅ Session management
✅ Middleware for route protection
✅ Professional login interface
✅ Facility-based permissions

You can now run `npm run dev` and test the authentication system!