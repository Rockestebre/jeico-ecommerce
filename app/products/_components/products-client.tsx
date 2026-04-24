'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProductCard } from '@/components/product-card'
import { FadeIn } from '@/components/ui/animate'
import { Skeleton } from '@/components/ui/skeleton'
import { CategoryIcon } from '@/components/category-icons'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  images: string[]
  category: { name: string; slug: string }
}

interface Category {
  id: string
  name: string
  slug: string
  icon: string
}

export function ProductsClient({ categories }: { categories: Category[] }) {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || '')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setSelectedCategory(categoryParam || '')
  }, [categoryParam])

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const res = await fetch(`/api/products?category=${selectedCategory || ''}&search=${search}`)
        if (res.ok) setProducts(await res.json())
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [selectedCategory, search])

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="sm:hidden gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      <div className={`mb-8 flex flex-wrap gap-2 ${showFilters ? 'block' : 'hidden sm:flex'}`}>
        <Button
          variant={selectedCategory === '' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('')}
        >
          Todos
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.slug ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat.slug)}
            className="gap-1.5"
          >
            <CategoryIcon icon={cat.slug} className="h-3.5 w-3.5" />
            {cat.name}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square rounded-lg" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Search className="h-12 w-12 mb-4 opacity-20" />
          <p className="text-lg font-medium">No se encontraron productos</p>
          <p className="text-sm">Intenta con otros términos de búsqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <FadeIn key={product.id}>
              <ProductCard product={product} />
            </FadeIn>
          ))}
        </div>
      )}
    </>
  )
}
