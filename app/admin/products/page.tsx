'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FadeIn } from '@/components/ui/animate'
import { Plus, Search, Pencil, Trash2, Package } from 'lucide-react'
import { toast } from 'sonner'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  images: string[]
  featured: boolean
  category: { name: string }
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    setLoading(true)
    try {
      const res = await fetch('/api/products')
      if (res.ok) setProducts(await res.json())
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Producto eliminado')
        loadProducts()
      } else {
        toast.error('Error al eliminar')
      }
    } catch {
      toast.error('Error al eliminar')
    }
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-bold tracking-tight">Productos</h1>
        <Link href="/admin/products/new">
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Plus className="h-4 w-4" />
            Nuevo producto
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar productos..."
          className="pl-9 max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <FadeIn>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Imagen</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Destacado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                        <Package className="mx-auto h-10 w-10 mb-2 opacity-20" />
                        No hay productos
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
                            {product.images?.[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                }}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Package className="h-4 w-4 text-muted-foreground opacity-40" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category?.name}</TableCell>
                        <TableCell>${product.price?.toLocaleString('es-CO', { maximumFractionDigits: 0 })}</TableCell>
                        <TableCell>
                          <span className={product.stock <= 0 ? 'text-destructive font-medium' : ''}>
                            {product.stock}
                          </span>
                        </TableCell>
                        <TableCell>
                          {product.featured && (
                            <Badge className="bg-primary text-primary-foreground">Si</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Button variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => deleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  )
}