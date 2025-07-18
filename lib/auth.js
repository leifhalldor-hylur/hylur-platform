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

    // Client admins see client facilities
    if (user.role === 'CLIENT_ADMIN') {
      return await prisma.facility.findMany({
        where: { status: 'active' }
      })
    }

    // Other users see only assigned facilities
    const facilityIdList = user.facilityIds.split(',').filter(Boolean)
    return await prisma.facility.findMany({
      where: { id: { in: facilityIdList } }
    })
  } catch (error) {
    console.error('Error fetching user facilities:', error)
    return []
  }
}
