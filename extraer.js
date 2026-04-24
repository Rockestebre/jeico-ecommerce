const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Iniciando extracción de productos...')

    const products = await prisma.product.findMany({
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const formattedProducts = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price ? Number(p.price) : 0,
      stock: p.stock,
      images: p.images,
      featured: p.featured,
      categoryId: p.categoryId,
      category: p.category,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }))

    // Ruta corregida para funcionar en Mac/Windows localmente
    const outputDir = path.join(__dirname, 'prisma')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    const outputPath = path.join(outputDir, 'products.json')
    fs.writeFileSync(outputPath, JSON.stringify(formattedProducts, null, 2), 'utf-8')

    console.log(`✅ ${formattedProducts.length} productos extraídos exitosamente`)
    console.log(`📂 Archivo guardado en: ${outputPath}`)
    console.log(`📈 Tamaño: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`)
  } catch (error) {
    console.error('❌ Error al extraer productos:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()