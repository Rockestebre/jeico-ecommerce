import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product-card'
import { CategoryIcon } from '@/components/category-icons'
import { FadeIn } from '@/components/ui/animate'
import { ArrowRight, Shield, Truck, Headphones } from 'lucide-react'
import { SafeImage } from '@/components/safe-image'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      include: { category: true },
      take: 6,
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
    }),
  ])

  // Corrección aplicada aquí para transformar el String a Array
  const formattedProducts = featuredProducts.map((p: any) => ({
    ...p,
    price: Number(p.price),
    images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
  }))

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="hero-gradient-jeico relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <FadeIn>
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                  <Shield className="h-4 w-4" />
                  Calidad garantizada
                </div>
                <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl uppercase">
                  Tienda de{' '}
                  <span className="text-primary">hobbies</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  Weapons, Knives, Hobbies & Fishing. Encuentra los mejores productos para tus pasiones con la calidad que solo JEICO te ofrece.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/products">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2">
                      Ver productos
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/products?category=weapons">
                    <Button size="lg" variant="outline">
                      Weapons
                    </Button>
                  </Link>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/50 bg-muted">
                <SafeImage
                  src="/images/hero-banner.jpg"
                  alt="JEICO - Tienda de Hobbies"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <p className="text-2xl font-display font-bold text-white">JEICO</p>
                  <p className="text-sm text-white/80">Hobbies & Outdoor</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <FadeIn>
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              Explora por categoría
            </h2>
            <p className="mt-2 text-muted-foreground">
              Encuentra exactamente lo que buscas
            </p>
          </div>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, i) => (
            <FadeIn key={category.id} delay={i * 0.1}>
              <Link href={`/products?category=${category.slug}`}>
                <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 md:p-6 text-center transition-all duration-normal hover:border-primary/50 hover:shadow-lg">
                  <div className="relative mx-auto mb-3 h-24 w-24 md:h-28 md:w-28 transition-transform group-hover:scale-105">
                    <CategoryIcon icon={category.slug} className="h-full w-full" />
                  </div>
                  <h3 className="font-display font-bold text-base tracking-wide uppercase">{category.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                    {category.description}
                  </p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {formattedProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 md:px-6">
          <FadeIn>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                  Destacados
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Los productos más populares de esta semana
                </p>
              </div>
              <Link href="/products" className="hidden md:block">
                <Button variant="outline" className="gap-2">
                  Ver todo
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {formattedProducts.map((product) => (
              <FadeIn key={product.id} delay={0.1}>
                <ProductCard product={product} />
              </FadeIn>
            ))}
          </div>
          <div className="mt-6 text-center md:hidden">
            <Link href="/products">
              <Button variant="outline" className="gap-2">
                Ver todo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Shield,
              title: 'Garantía de calidad',
              desc: 'Todos nuestros productos son verificados y cuentan con garantía.',
            },
            {
              icon: Truck,
              title: 'Envíos rápidos',
              desc: 'Entregamos en todo el país con los mejores tiempos de envío.',
            },
            {
              icon: Headphones,
              title: 'Soporte especializado',
              desc: 'Nuestro equipo conoce cada producto y te asesora personalmente.',
            },
          ].map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 0.1}>
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-medium">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  )
}