import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

function formatCartItem(item: any) {
  return {
    ...item,
    product: {
      ...item.product,
      price: item.product.price ? Number(item.product.price) : 0,
    },
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ items: [] })
    }

    const items = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ items: items.map(formatCartItem) })
  } catch (error) {
    console.error('GET cart error:', error)
    return NextResponse.json(
      { error: 'Error al obtener carrito' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { productId, quantity } = body

    if (!productId || quantity < 1) {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      )
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    })

    let cartItem
    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: { include: { category: true } } },
      })
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          productId,
          quantity,
        },
        include: { product: { include: { category: true } } },
      })
    }

    return NextResponse.json(formatCartItem(cartItem))
  } catch (error) {
    console.error('POST cart error:', error)
    return NextResponse.json(
      { error: 'Error al agregar al carrito' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { productId, quantity } = body

    if (!productId || quantity < 1) {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      )
    }

    const cartItem = await prisma.cartItem.updateMany({
      where: {
        userId: session.user.id,
        productId,
      },
      data: { quantity },
    })

    return NextResponse.json({ success: true, updated: cartItem.count })
  } catch (error) {
    console.error('PUT cart error:', error)
    return NextResponse.json(
      { error: 'Error al actualizar carrito' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')

    if (productId) {
      await prisma.cartItem.deleteMany({
        where: {
          userId: session.user.id,
          productId,
        },
      })
    } else {
      await prisma.cartItem.deleteMany({
        where: { userId: session.user.id },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE cart error:', error)
    return NextResponse.json(
      { error: 'Error al eliminar del carrito' },
      { status: 500 }
    )
  }
}
