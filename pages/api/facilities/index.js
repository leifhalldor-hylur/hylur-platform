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

        // CEO and COO can see all facilities
        if (['CEO', 'COO'].includes(user.role)) {
          facilities = await prisma.facility.findMany({
            orderBy: { createdAt: 'desc' }
          })
        } else if (user.role === 'CLIENT_ADMIN') {
          // Client admins see client facilities
          facilities = await prisma.facility.findMany({
            where: { status: 'active' },
            orderBy: { createdAt: 'desc' }
          })
        } else {
          // Other users see only assigned facilities
          const facilityIdList = user.facilityIds || []
          facilities = await prisma.facility.findMany({
            where: { id: { in: facilityIdList } },
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

export default withAuth(handler, ['view_all_analytics'])
