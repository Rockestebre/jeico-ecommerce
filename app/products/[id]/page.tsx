'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { FadeIn } from '@/components/ui/animate'
import { useCart } from '@/components/cart/cart-context'
import { CategoryIcon } from '@/components/category-icons'
import { ArrowLeft, ShoppingCart, Minus, Plus, Package } from 'lucide-react'
import { toast } from 'sonner'

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  stock: number
  images: string[]
  featured: boolean
  category: { name: string; slug: string; icon: string }
}

export default function ProductDetailPage() {
  const { id } = useParams() as { id: string }
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  useEffect(() => {
    async function loadProduct() {
      setLoading(true)
      try {
        const res = await fetch(`/api/products/${id}`)
        if (res.ok) {
          const data = await res.json()
          setProduct(data)
          setQuantity(1)
        }
      } catch {
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [id])

  const handleAddToCart = async () => {
    if (!product) return
    if (product.stock <= 0) {
      toast.error('Producto agotado')
      return
    }
    await addToCart(product.id, quantity)
    toast.success(`${product.name} x${quantity} agregado al carrito`)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center md:px-6">
        <Package className="mx-auto h-16 w-16 text-muted-foreground opacity-20" />
        <h1 className="mt-4 font-display text-xl font-bold">Producto no encontrado</h1>
        <p className="mt-2 text-muted-foreground">El producto que buscas no existe o fue eliminado.</p>
        <Link href="/products" className="mt-6 inline-block">
          <Button>Ver productos</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <FadeIn>
        <Link href="/products" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Volver a productos
        </Link>
      </FadeIn>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <FadeIn>
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
              {product.images?.[selectedImage] ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Package className="h-16 w-16 text-muted-foreground opacity-20" />
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage === i ? 'border-primary' : 'border-transparent hover:border-border'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </FadeIn>

        {/* Info */}
        <FadeIn delay={0.1}>
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <CategoryIcon icon={product.category.slug} className="h-3 w-3" />
                {product.category.name}
              </Badge>
              {product.featured && (
                <Badge className="bg-primary text-primary-foreground">Destacado</Badge>
              )}
              {product.stock <= 0 && (
                <Badge variant="destructive">Agotado</Badge>
              )}
            </div>

            <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              {product.name}
            </h1>

            <p className="text-3xl font-bold text-primary">
              ${product.price?.toFixed(2)}
            </p>

            {product.description && (
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Stock disponible: {product.stock} unidades
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-lg border border-border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-muted"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 hover:bg-muted"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90 gap-2"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Agregar al carrito
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
