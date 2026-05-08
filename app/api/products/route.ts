import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

function formatProduct(product: any) {
  let images = product.images
  if (typeof images === 'string') {
    try { images = JSON.parse(images) } catch { images = [] }
  }
  if (!Array.isArray(images)) images = []

  return {
    ...product,
    price: product.price ? Number(product.price) : 0,
    images,
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')

    const where: any = {}

    if (category) {
      where.category = { slug: category }
    }

    if (featured === 'true') {
      where.featured = true
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products.map(formatProduct))
  } catch (error) {
    console.error('GET products error:', error)
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { name, slug, description, price, stock, images, featured, categoryId } = body

    if (!name || !slug || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    const existing = await prisma.product.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe un producto con ese slug' },
        { status: 409 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || null,
        price,
        stock: stock ?? 0,
        images: JSON.stringify(images ?? []),
        featured: featured ?? false,
        categoryId,
      },
      include: { category: true },
    })

    return NextResponse.json(formatProduct(product), { status: 201 })
  } catch (error) {
    console.error('POST product error:', error)
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    )
  }
}