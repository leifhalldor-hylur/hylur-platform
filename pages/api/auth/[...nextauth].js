import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Hylur BESS Platform Role Permissions
const ROLE_PERMISSIONS = {
  CEO: [
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

// Automatic role assignment for Hylur founders
function getDefaultRole(email) {
  if (email === 'haukur@hylur.net') return 'CEO'    // Haukur - Business Development CEO
  if (email === 'leif@hylur.net') return 'COO'      // Leif - Mechatronics Engineer COO
  if (email.includes('admin') && !email.endsWith('@hylur.net')) return 'CLIENT_ADMIN'
  if (!email.endsWith('@hylur.net')) return 'CLIENT_USER'
  return 'GUEST' // Future team members
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          hd: "hylur.net", // Restrict to @hylur.net domain only
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
        // Verify @hylur.net domain and email verification
        const isValidDomain = profile.email_verified && 
                            profile.email.endsWith("@hylur.net")
        
        if (!isValidDomain) {
          console.log(`🚫 Sign-in rejected for ${profile.email} - invalid domain`)
          return false
        }

        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email }
          })

          if (!existingUser) {
            const role = getDefaultRole(profile.email)
            let title = ''
            let expertise = ''
            let department = ''

            // Set founder-specific details
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
            
            console.log(`✅ New user created: ${profile.email} as ${role}`)
          }
        } catch (error) {
          console.error('❌ Error creating user:', error)
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
            session.user.facilityIds = dbUser.facilityIds.split(',').filter(Boolean)
            session.user.permissions = ROLE_PERMISSIONS[dbUser.role] || []
          } else {
            return null
          }
        } catch (error) {
          console.error('❌ Error fetching user session data:', error)
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
      console.log(`🔐 User ${user.email} signed in via ${account.provider}`)
    },
    async signOut({ session }) {
      console.log(`🚪 User ${session?.user?.email} signed out`)
    }
  }
}

export default NextAuth(authOptions)
