const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Hylur BESS database...')

  // Create sample BESS facilities
  const facility1 = await prisma.facility.create({
    data: {
      name: 'Hylur Demo BESS Facility 1',
      location: 'Reykjavik, Iceland',
      capacity: 10.5,
      status: 'active',
      clientId: 'demo-client-1'
    }
  })

  const facility2 = await prisma.facility.create({
    data: {
      name: 'Hylur Demo BESS Facility 2', 
      location: 'Akureyri, Iceland',
      capacity: 25.0,
      status: 'active',
      clientId: 'demo-client-2'
    }
  })

  const facility3 = await prisma.facility.create({
    data: {
      name: 'Nordic Energy Storage Hub',
      location: 'Oslo, Norway', 
      capacity: 50.0,
      status: 'active',
      clientId: 'nordic-energy-corp'
    }
  })

  console.log('✅ Sample BESS facilities created:', { facility1, facility2, facility3 })
  console.log('🎉 Hylur database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
