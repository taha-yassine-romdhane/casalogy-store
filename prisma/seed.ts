import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Medical colors from our constants
const MEDICAL_COLORS = [
  // Blues (Most popular in healthcare)
  { name: 'Navy Blue', hex: '#003366', pantone: '533C', sortOrder: 1 },
  { name: 'Ceil Blue', hex: '#8AC5D8', pantone: '5415C', sortOrder: 2 },
  { name: 'Royal Blue', hex: '#4169E1', pantone: '286C', sortOrder: 3 },
  { name: 'Caribbean Blue', hex: '#00CED1', pantone: '3125C', sortOrder: 4 },
  { name: 'Galaxy Blue', hex: '#2C5985', pantone: '7469C', sortOrder: 5 },
  { name: 'Ciel', hex: '#A4C8E1', pantone: '543C', sortOrder: 6 },
  { name: 'Turquoise', hex: '#40E0D0', pantone: '3252C', sortOrder: 7 },
  { name: 'Powder Blue', hex: '#B0E0E6', pantone: '656C', sortOrder: 8 },
  { name: 'Slate Blue', hex: '#6A5ACD', pantone: '2725C', sortOrder: 9 },
  
  // Greens
  { name: 'Surgical Green', hex: '#7CB342', pantone: '7489C', sortOrder: 10 },
  { name: 'Hunter Green', hex: '#355E3B', pantone: '5535C', sortOrder: 11 },
  { name: 'Olive', hex: '#6B8E23', pantone: '5757C', sortOrder: 12 },
  { name: 'Sage Green', hex: '#87A96B', pantone: '5783C', sortOrder: 13 },
  { name: 'Mint', hex: '#98FB98', pantone: '351C', sortOrder: 14 },
  { name: 'Emerald', hex: '#50C878', pantone: '3415C', sortOrder: 15 },
  { name: 'Seafoam', hex: '#93E9BE', pantone: '332C', sortOrder: 16 },
  { name: 'Teal', hex: '#008B8B', pantone: '3155C', sortOrder: 17 },
  
  // Grays & Neutrals (Essential basics)
  { name: 'Black', hex: '#000000', pantone: 'Black C', sortOrder: 18 },
  { name: 'Charcoal', hex: '#36454F', pantone: '432C', sortOrder: 19 },
  { name: 'Pewter Gray', hex: '#91989F', pantone: '429C', sortOrder: 20 },
  { name: 'White', hex: '#FFFFFF', pantone: 'White', sortOrder: 21 },
  
  // Popular accent colors
  { name: 'Wine', hex: '#722F37', pantone: '7428C', sortOrder: 22 },
  { name: 'Burgundy', hex: '#800020', pantone: '7421C', sortOrder: 23 },
  { name: 'Plum', hex: '#8E4585', pantone: '2583C', sortOrder: 24 }
]

// Medical sizes by category
const MEDICAL_SIZES = [
  // Unisex sizes
  { name: 'XXS', label: 'XX-Small', category: 'UNISEX', sortOrder: 1 },
  { name: 'XS', label: 'X-Small', category: 'UNISEX', sortOrder: 2 },
  { name: 'S', label: 'Small', category: 'UNISEX', sortOrder: 3 },
  { name: 'M', label: 'Medium', category: 'UNISEX', sortOrder: 4 },
  { name: 'L', label: 'Large', category: 'UNISEX', sortOrder: 5 },
  { name: 'XL', label: 'X-Large', category: 'UNISEX', sortOrder: 6 },
  { name: '2XL', label: '2X-Large', category: 'UNISEX', sortOrder: 7 },
  { name: '3XL', label: '3X-Large', category: 'UNISEX', sortOrder: 8 },
  { name: '4XL', label: '4X-Large', category: 'UNISEX', sortOrder: 9 },
  { name: '5XL', label: '5X-Large', category: 'UNISEX', sortOrder: 10 },
  
  // Women's sizes
  { name: 'XXS', label: 'XX-Small', category: 'WOMEN', sortOrder: 1 },
  { name: 'XS', label: 'X-Small', category: 'WOMEN', sortOrder: 2 },
  { name: 'S', label: 'Small', category: 'WOMEN', sortOrder: 3 },
  { name: 'M', label: 'Medium', category: 'WOMEN', sortOrder: 4 },
  { name: 'L', label: 'Large', category: 'WOMEN', sortOrder: 5 },
  { name: 'XL', label: 'X-Large', category: 'WOMEN', sortOrder: 6 },
  { name: '2XL', label: '2X-Large', category: 'WOMEN', sortOrder: 7 },
  { name: '3XL', label: '3X-Large', category: 'WOMEN', sortOrder: 8 },
  
  // Men's sizes
  { name: 'S', label: 'Small', category: 'MEN', sortOrder: 1 },
  { name: 'M', label: 'Medium', category: 'MEN', sortOrder: 2 },
  { name: 'L', label: 'Large', category: 'MEN', sortOrder: 3 },
  { name: 'XL', label: 'X-Large', category: 'MEN', sortOrder: 4 },
  { name: '2XL', label: '2X-Large', category: 'MEN', sortOrder: 5 },
  { name: '3XL', label: '3X-Large', category: 'MEN', sortOrder: 6 },
  { name: '4XL', label: '4X-Large', category: 'MEN', sortOrder: 7 },
  { name: '5XL', label: '5X-Large', category: 'MEN', sortOrder: 8 },
  
  // Petite sizes
  { name: 'XSP', label: 'X-Small Petite', category: 'PETITE', sortOrder: 1 },
  { name: 'SP', label: 'Small Petite', category: 'PETITE', sortOrder: 2 },
  { name: 'MP', label: 'Medium Petite', category: 'PETITE', sortOrder: 3 },
  { name: 'LP', label: 'Large Petite', category: 'PETITE', sortOrder: 4 },
  { name: 'XLP', label: 'X-Large Petite', category: 'PETITE', sortOrder: 5 },
  
  // Tall sizes
  { name: 'ST', label: 'Small Tall', category: 'TALL', sortOrder: 1 },
  { name: 'MT', label: 'Medium Tall', category: 'TALL', sortOrder: 2 },
  { name: 'LT', label: 'Large Tall', category: 'TALL', sortOrder: 3 },
  { name: 'XLT', label: 'X-Large Tall', category: 'TALL', sortOrder: 4 },
  { name: '2XLT', label: '2X-Large Tall', category: 'TALL', sortOrder: 5 }
]

async function main() {
  console.log('🌱 Starting database seeding...')

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@casalogy.tn' }
  })

  if (!existingAdmin) {
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12)

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'admin@casalogy.tn',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'Casalogy',
        phone: '+216 70 123 456',
        address: '123 Avenue Habib Bourguiba',
        region: 'tunis',
        role: 'ADMIN',
        isVerified: true,
        isStudent: false,
      }
    })

    console.log('✅ Admin user created successfully:')
    console.log({
      id: admin.id,
      email: admin.email,
      name: `${admin.firstName} ${admin.lastName}`,
      role: admin.role
    })
  } else {
    console.log('👤 Admin user already exists, skipping creation')
  }

  // Create some basic categories
  console.log('📂 Creating basic categories...')

  const categories = [
    {
      name: 'Scrubs',
      slug: 'scrubs',
      description: 'Professional medical scrubs for healthcare workers',
      sortOrder: 1
    },
    {
      name: 'Lab Coats',
      slug: 'lab-coats', 
      description: 'White coats for medical students and professionals',
      sortOrder: 2
    },
    {
      name: 'Underscrubs',
      slug: 'underscrubs',
      description: 'Comfortable base layers for medical wear',
      sortOrder: 3
    },
    {
      name: 'Outerwear',
      slug: 'outerwear',
      description: 'Jackets, coats, and outer garments for medical professionals',
      sortOrder: 4
    },
    {
      name: 'Footwear',
      slug: 'footwear',
      description: 'Medical shoes and clogs for all-day comfort',
      sortOrder: 5
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Stethoscopes, badges, and medical accessories',
      sortOrder: 6
    }
  ]

  for (const category of categories) {
    const existingCategory = await prisma.category.findUnique({
      where: { slug: category.slug }
    })

    if (!existingCategory) {
      await prisma.category.create({
        data: category
      })
      console.log(`✅ Category created: ${category.name}`)
    } else {
      console.log(`⚠️  Category already exists: ${category.name}`)
    }
  }

  // Seed medical colors as system colors
  console.log('🎨 Seeding medical colors...')
  for (const color of MEDICAL_COLORS) {
    const existingColor = await prisma.color.findUnique({
      where: { hexCode: color.hex }
    })

    if (!existingColor) {
      await prisma.color.create({
        data: {
          name: color.name,
          hexCode: color.hex,
          pantoneCode: color.pantone,
          sortOrder: color.sortOrder,
          isSystem: true,
          isActive: true
        }
      })
      console.log(`✅ Color created: ${color.name} (${color.hex})`)
    } else {
      // Update existing color to be system color
      await prisma.color.update({
        where: { id: existingColor.id },
        data: {
          name: color.name,
          pantoneCode: color.pantone,
          sortOrder: color.sortOrder,
          isSystem: true,
          isActive: true
        }
      })
      console.log(`⚠️  Color updated: ${color.name}`)
    }
  }

  // Seed medical sizes
  console.log('📏 Seeding medical sizes...')
  for (const size of MEDICAL_SIZES) {
    const existingSize = await prisma.size.findFirst({
      where: { 
        name: size.name,
        category: size.category
      }
    })

    if (!existingSize) {
      await prisma.size.create({
        data: {
          name: size.name,
          label: size.label,
          category: size.category,
          sortOrder: size.sortOrder,
          isActive: true
        }
      })
      console.log(`✅ Size created: ${size.name} ${size.category} (${size.label})`)
    } else {
      console.log(`⚠️  Size already exists: ${size.name} ${size.category}`)
    }
  }

  console.log('🎉 Database seeding completed successfully!')
  console.log('')
  console.log('📋 Admin Login Credentials:')
  console.log('Email: admin@casalogy.tn')
  console.log('Password: admin123')
  console.log('')
  console.log('⚠️  IMPORTANT: Change the admin password after first login!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:')
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })