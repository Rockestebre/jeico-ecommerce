'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart/cart-context'
import { toast } from 'sonner'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    stock: number
    images: any 
    category: {
      name: string
      slug: string
    }
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  let imageList: string[] = []
  if (typeof product.images === 'string') {
    try {
      imageList = JSON.parse(product.images)
    } catch (e) {
      imageList = [] 
    }
  } else if (Array.isArray(product.images)) {
    imageList = product.images
  }

  const firstImage = imageList[0]

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.stock <= 0) {
      toast.error('Producto agotado')
      return
    }
    await addToCart(product.id, 1)
    toast.success(`${product.name} agregado al carrito`)
  }

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative overflow-hidden rounded-lg border border-border bg-card transition-all duration-normal hover:shadow-lg hover:border-primary/30">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-normal group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <span className="text-4xl font-bold opacity-10">JEICO</span>
            </div>
          )}
          {product.stock <= 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <span className="rounded bg-destructive px-3 py-1 text-xs font-bold text-white">
                AGOTADO
              </span>
            </div>
          )}
        </div>

        <div className="p-4 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-primary">
            {product.category?.name}
          </p>
          <h3 className="font-medium line-clamp-1 text-sm group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            {/* 🛠️ AQUÍ ESTÁ EL CAMBIO: Formato de miles y COP */}
            <span className="text-lg font-bold">${product.price?.toLocaleString('es-CO')} COP</span>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}