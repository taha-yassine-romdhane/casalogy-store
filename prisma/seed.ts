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

  // Create test products with images
  console.log('🛒 Creating test products...')

  const testProductImages = [
    'DSC01519.jpg', 'DSC01526.jpg', 'DSC01529.jpg', 'DSC01533.jpg', 'DSC01534.jpg', 'DSC01536.jpg',
    'DSC01539.jpg', 'DSC01547.jpg', 'DSC01548.jpg', 'DSC01552.jpg', 'DSC01557.jpg', 'DSC01559.jpg',
    'DSC01563.jpg', 'DSC01566.jpg', 'DSC01571.jpg', 'DSC01577.jpg', 'DSC01580.jpg', 'DSC01585.jpg',
    'DSC01593.jpg', 'DSC01599.jpg', 'DSC01612.jpg', 'DSC01619.jpg', 'DSC01620.jpg', 'DSC01628.jpg',
    'DSC01634.jpg', 'DSC01637.jpg'
  ]

  // Get created categories, colors, and sizes for product variants
  const scrubsCategory = await prisma.category.findUnique({ where: { slug: 'scrubs' } })
  const labCoatsCategory = await prisma.category.findUnique({ where: { slug: 'lab-coats' } })
  const underscrubsCategory = await prisma.category.findUnique({ where: { slug: 'underscrubs' } })
  const outerwearCategory = await prisma.category.findUnique({ where: { slug: 'outerwear' } })

  const colors = await prisma.color.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } })
  const unisexSizes = await prisma.size.findMany({ where: { category: 'UNISEX', isActive: true }, orderBy: { sortOrder: 'asc' } })
  const womenSizes = await prisma.size.findMany({ where: { category: 'WOMEN', isActive: true }, orderBy: { sortOrder: 'asc' } })
  const menSizes = await prisma.size.findMany({ where: { category: 'MEN', isActive: true }, orderBy: { sortOrder: 'asc' } })

  const testProducts = [
    {
      name: 'Professional Medical Scrub Set',
      slug: 'professional-medical-scrub-set',
      description: 'High-quality medical scrubs designed for comfort and durability. Features moisture-wicking fabric and multiple pockets.',
      shortDescription: 'Professional scrub set with moisture-wicking fabric',
      categoryId: scrubsCategory?.id,
      basePrice: 89.99,
      images: [testProductImages[0], testProductImages[1], testProductImages[2]],
      colors: [colors[0], colors[1], colors[9]], // Navy Blue, Ceil Blue, Surgical Green
      sizes: unisexSizes.slice(1, 7), // XS to XL
      isActive: true,
      isFeatured: true
    },
    {
      name: 'Classic White Lab Coat',
      slug: 'classic-white-lab-coat',
      description: 'Traditional white lab coat for medical students and professionals. Made from durable cotton-poly blend.',
      shortDescription: 'Traditional white lab coat for medical professionals',
      categoryId: labCoatsCategory?.id,
      basePrice: 124.99,
      images: [testProductImages[3], testProductImages[4]],
      colors: [colors.find(c => c.name === 'White')], // White only
      sizes: unisexSizes.slice(0, 8), // XXS to 3XL
      isActive: true,
      isFeatured: true
    },
    {
      name: 'Women\'s Fitted Scrub Top',
      slug: 'womens-fitted-scrub-top',
      description: 'Tailored scrub top designed specifically for women with a flattering fit and functional design.',
      shortDescription: 'Fitted scrub top designed for women',
      categoryId: scrubsCategory?.id,
      basePrice: 45.99,
      images: [testProductImages[5], testProductImages[6], testProductImages[7]],
      colors: [colors[1], colors[2], colors[8], colors[13]], // Ceil Blue, Royal Blue, Slate Blue, Mint
      sizes: womenSizes.slice(1, 7), // XS to XL
      isActive: true,
      isFeatured: false
    },
    {
      name: 'Men\'s Classic Scrub Pants',
      slug: 'mens-classic-scrub-pants',
      description: 'Comfortable and durable scrub pants for men with reinforced seams and multiple pockets.',
      shortDescription: 'Classic scrub pants with reinforced seams',
      categoryId: scrubsCategory?.id,
      basePrice: 52.99,
      images: [testProductImages[8], testProductImages[9]],
      colors: [colors[0], colors[17], colors[18]], // Navy Blue, Black, Charcoal
      sizes: menSizes, // All men's sizes
      isActive: true,
      isFeatured: false
    },
    {
      name: 'Thermal Underscrub Long Sleeve',
      slug: 'thermal-underscrub-long-sleeve',
      description: 'Warm base layer perfect for cold environments. Soft, breathable fabric keeps you comfortable all day.',
      shortDescription: 'Thermal base layer for cold environments',
      categoryId: underscrubsCategory?.id,
      basePrice: 34.99,
      images: [testProductImages[10], testProductImages[11]],
      colors: [colors[17], colors[20]], // Black, White
      sizes: unisexSizes.slice(1, 8), // XS to 3XL
      isActive: true,
      isFeatured: false
    },
    {
      name: 'Medical Warm-Up Jacket',
      slug: 'medical-warm-up-jacket',
      description: 'Lightweight jacket perfect for layering. Features zip-front closure and side pockets.',
      shortDescription: 'Lightweight medical warm-up jacket',
      categoryId: outerwearCategory?.id,
      basePrice: 78.99,
      images: [testProductImages[12], testProductImages[13], testProductImages[14]],
      colors: [colors[0], colors[9], colors[17]], // Navy Blue, Surgical Green, Black
      sizes: unisexSizes.slice(1, 7), // XS to XL
      isActive: true,
      isFeatured: true
    },
    {
      name: 'Premium Scrub Set - Caribbean Collection',
      slug: 'premium-scrub-set-caribbean',
      description: 'Premium scrub set in beautiful Caribbean blue. Made from high-performance fabric with antimicrobial properties.',
      shortDescription: 'Premium scrub set with antimicrobial properties',
      categoryId: scrubsCategory?.id,
      basePrice: 149.99,
      images: [testProductImages[15], testProductImages[16], testProductImages[17]],
      colors: [colors[3], colors[6]], // Caribbean Blue, Turquoise
      sizes: unisexSizes.slice(1, 8), // XS to 3XL
      isActive: true,
      isFeatured: true
    },
    {
      name: 'Student Scrub Starter Pack',
      slug: 'student-scrub-starter-pack',
      description: 'Affordable scrub set perfect for medical students. Includes top and bottom in classic colors.',
      shortDescription: 'Affordable starter pack for medical students',
      categoryId: scrubsCategory?.id,
      basePrice: 69.99,
      images: [testProductImages[18], testProductImages[19]],
      colors: [colors[0], colors[1], colors[9]], // Navy Blue, Ceil Blue, Surgical Green
      sizes: unisexSizes.slice(1, 7), // XS to XL
      isActive: true,
      isFeatured: false
    }
  ]

  for (let i = 0; i < testProducts.length; i++) {
    const product = testProducts[i]

    // Check if product already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug: product.slug }
    })

    if (existingProduct) {
      console.log(`⚠️  Product already exists: ${product.name}`)
      continue
    }

    try {
      // Create the base product
      const createdProduct = await prisma.product.create({
        data: {
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDescription: product.shortDescription,
          price: product.basePrice,
          categoryId: product.categoryId!,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          sku: `TEST-${String(i + 1).padStart(3, '0')}`,
          fabricType: 'Premium Cotton Blend',
          pocketCount: 6,
          gender: 'Unisex',
          metaTitle: product.name,
          metaDescription: product.shortDescription
        }
      })

      // Create product colors and their images
      let colorIndex = 0
      for (const color of product.colors) {
        const productColor = await prisma.productColor.create({
          data: {
            productId: createdProduct.id,
            colorId: color.id,
            colorName: color.name,
            colorCode: color.hexCode,
            pantoneCode: color.pantoneCode,
            sortOrder: colorIndex
          }
        })

        // Create product images for this color
        const colorImages = product.images.slice(colorIndex * 2, (colorIndex + 1) * 2) // 2 images per color
        if (colorImages.length === 0 && product.images.length > 0) {
          colorImages.push(product.images[0]) // Fallback to first image
        }

        for (let imgIndex = 0; imgIndex < colorImages.length; imgIndex++) {
          await prisma.productImage.create({
            data: {
              productId: createdProduct.id,
              colorId: productColor.id,
              url: `/test-products/${colorImages[imgIndex]}`,
              altText: `${product.name} - ${color.name}`,
              sortOrder: imgIndex,
              isMain: imgIndex === 0
            }
          })
        }

        // Create product variants for each size in this color
        for (const size of product.sizes) {
          await prisma.productVariant.create({
            data: {
              productId: createdProduct.id,
              colorId: productColor.id,
              sizeId: size.id,
              sku: `${createdProduct.sku}-${color.name.replace(/\s+/g, '').toUpperCase()}-${size.name}`,
              price: product.basePrice,
              quantity: Math.floor(Math.random() * 50) + 10, // Random stock between 10-59
              lowStockThreshold: 5,
              isActive: true
            }
          })
        }

        colorIndex++
      }

      const totalVariants = product.colors.length * product.sizes.length
      console.log(`✅ Product created: ${product.name} (${product.colors.length} colors, ${totalVariants} variants)`)
    } catch (error) {
      console.error(`❌ Error creating product: ${product.name}`, error)
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