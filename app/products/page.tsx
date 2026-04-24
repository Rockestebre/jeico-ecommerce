import { Suspense } from 'react'
import { prisma } from '@/lib/db'
import { ProductsClient } from './_components/products-client'
import { FadeIn } from '@/components/ui/animate'

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <FadeIn>
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Productos
          </h1>
          <p className="mt-2 text-muted-foreground">
            Explora nuestro catálogo completo
          </p>
        </div>
      </FadeIn>

      <Suspense fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-square rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      }>
        <ProductsClient categories={categories} />
      </Suspense>
    </div>
  )
}
