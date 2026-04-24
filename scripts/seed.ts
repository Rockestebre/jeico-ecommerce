import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('jeico123', 12)

  const user = await prisma.user.upsert({
    where: { email: 'jeison@jeico.com' },
    update: {},
    create: {
      email: 'jeison@jeico.com',
      name: 'Jeison',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      name: 'John Doe',
      password: await bcrypt.hash('johndoe123', 12),
      role: 'USER',
    },
  })

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'weapons' },
      update: {},
      create: {
        name: 'Weapons',
        slug: 'weapons',
        description: 'Armas y accesorios de tiro',
        icon: 'Crosshair',
        image: '/images/categories/weapons.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'knives' },
      update: {},
      create: {
        name: 'Knives',
        slug: 'knives',
        description: 'Cuchillos tácticos y de colección',
        icon: 'Swords',
        image: '/images/categories/knives.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'hobbies' },
      update: {},
      create: {
        name: 'Hobbies',
        slug: 'hobbies',
        description: 'Hobbies y coleccionables',
        icon: 'Gamepad2',
        image: '/images/categories/hobbies.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'fishing' },
      update: {},
      create: {
        name: 'Fishing',
        slug: 'fishing',
        description: 'Equipos y accesorios de pesca',
        icon: 'Fish',
        image: '/images/categories/fishing.jpg',
      },
    }),
  ])

  const weaponsCat = categories.find((c) => c.slug === 'weapons')
  const knivesCat = categories.find((c) => c.slug === 'knives')

  if (weaponsCat && knivesCat) {
    await prisma.product.upsert({
      where: { slug: 'pistola-glock-19-gen5' },
      update: {},
      create: {
        name: 'Pistola Glock 19 Gen5',
        slug: 'pistola-glock-19-gen5',
        description: 'La Glock 19 Gen5 es una pistola compacta de 9x19mm con mecanismos de seguridad avanzados, ideal para defensa personal y tiro deportivo. Incluye cargador de 15 tiros y cañón de 4.02 pulgadas.',
        price: 650.00,
        stock: 12,
        images: ['/uploads/glock19-gen5-1.jpg'],
        featured: true,
        categoryId: weaponsCat.id,
      },
    })

    await prisma.product.upsert({
      where: { slug: 'cuchillo-tactico-ka-bar' },
      update: {},
      create: {
        name: 'Cuchillo Táctico KA-BAR USMC',
        slug: 'cuchillo-tactico-ka-bar',
        description: 'Cuchillo de combate legítimo de la Marina de EE.UU. Hoja de 7 pulgadas en acero al carbono 1095 Cro-Van con tratamiento térmico. Incluye funda de cuero auténtica.',
        price: 125.00,
        stock: 25,
        images: ['/uploads/kabar-usmc-1.jpg'],
        featured: true,
        categoryId: knivesCat.id,
      },
    })
  }

  console.log('Seed completado exitosamente')
  console.log('Admin user:', user.email, user.role)
  console.log('Test user:', user2.email, user2.role)
  console.log('Categories:', categories.map((c) => c.name).join(', '))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
