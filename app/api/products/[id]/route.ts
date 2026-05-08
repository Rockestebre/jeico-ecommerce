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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: params.id },
          { id: params.id },
        ]
      },
      include: { category: true },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(formatProduct(product))
  } catch (error) {
    console.error('GET product error:', error)
    return NextResponse.json(
      { error: 'Error al obtener producto' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const existing = await prisma.product.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    if (slug && slug !== existing.slug) {
      const duplicate = await prisma.product.findUnique({ where: { slug } })
      if (duplicate) {
        return NextResponse.json(
          { error: 'Ya existe un producto con ese slug' },
          { status: 409 }
        )
      }
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: name ?? undefined,
        slug: slug ?? undefined,
        description: description !== undefined ? description : undefined,
        price: price !== undefined ? price : undefined,
        stock: stock !== undefined ? stock : undefined,
        images: images !== undefined ? JSON.stringify(images) : undefined,
        featured: featured !== undefined ? featured : undefined,
        categoryId: categoryId ?? undefined,
      },
      include: { category: true },
    })

    return NextResponse.json(formatProduct(product))
  } catch (error) {
    console.error('PUT product error:', error)
    return NextResponse.json(
      { error: 'Error al actualizar producto' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const existing = await prisma.product.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    await prisma.product.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE product error:', error)
    return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    )
  }
}