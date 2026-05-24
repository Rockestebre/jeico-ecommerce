import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product-card'
import { CategoryIcon } from '@/components/category-icons'
import { FadeIn } from '@/components/ui/animate'
import { ArrowRight, Shield, Truck, Headphones, Instagram, Store } from 'lucide-react'
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
      <section className="relative overflow-hidden -mt-px flex items-center min-h-[calc(100vh-4rem)]" style={{ background: 'radial-gradient(ellipse 90% 80% at 75% 50%, #D8071B 0%, #8B0C24 35%, #1a0508 75%, #0F0F0F 100%)' }}>
        {/* Efecto cortinas verticales */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'repeating-linear-gradient(90deg, transparent 0, transparent 28px, rgba(0,0,0,0.22) 28px, rgba(0,0,0,0.22) 30px)' }} />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-12">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-10 items-center">

            {/* Columna izquierda - texto */}
            <FadeIn>
              <div className="space-y-7">
                {/* Tagline */}
                <div className="inline-flex items-center gap-3 text-xs md:text-sm text-white/70 font-semibold tracking-[0.25em] uppercase">
                  <span className="h-px w-10 bg-white/40" />
                  Tienda de Hobbies
                </div>

                {/* Título principal */}
                <div>
                  <span className="block text-lg md:text-xl text-white/80 font-medium mb-3">Bienvenido a</span>
                  <h1 className="font-display font-black tracking-tight uppercase leading-[0.9] text-white text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
                    JEICO
                    <span className="block text-white/30">Store</span>
                  </h1>
                </div>

                {/* Descripción */}
                <p className="text-base md:text-lg text-white/80 max-w-md leading-relaxed">
                  Weapons, Knives, Hobbies & Fishing. Todo para tu aventura, supervivencia y pasiones.
                </p>

                {/* CTA + avatares */}
                <div className="flex flex-wrap items-center gap-6 pt-2">
                  {/* Botón píldora con flecha */}
                  <Link href="/products" className="group inline-flex items-center gap-3 rounded-full bg-white pl-6 pr-2 py-2 font-bold text-black shadow-xl transition-transform hover:scale-105">
                    <span>Ver productos</span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D8071B] text-white transition-transform group-hover:rotate-[-45deg]">
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </Link>

                  {/* Avatares de categorías + stat */}
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {['weapons', 'knives', 'fishing', 'hobbies'].map((cat) => (
                        <div key={cat} className="relative h-11 w-11 rounded-full border-2 border-white/15 bg-[#0F0F0F] overflow-hidden shadow-lg">
                          <Image src={`/brand/icon-${cat}.png`} alt={cat} fill className="object-contain p-1.5" sizes="44px" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-tight">4 categorías</p>
                      <p className="text-xs text-white/60">en stock</p>
                    </div>
                  </div>
                </div>

                {/* Redes sociales sutiles */}
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-xs text-white/40 uppercase tracking-[0.2em] font-semibold">Síguenos</span>
                  <span className="h-px w-6 bg-white/20" />
                  <a href="https://www.instagram.com/jeico.hobbies/" target="_blank" rel="noopener noreferrer" className="text-white/50 transition-colors hover:text-white" aria-label="Instagram">
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a href="https://www.tiktok.com/@jeico_sm?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="text-white/50 transition-colors hover:text-white" aria-label="TikTok">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.7a8.18 8.18 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.13z" /></svg>
                  </a>
                </div>
              </div>
            </FadeIn>

            {/* Columna derecha - imagen */}
            <FadeIn delay={0.2}>
              <div className="relative">
                <div className="relative mx-auto max-h-[50vh] lg:max-h-[75vh] aspect-[9/16] overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-black">
                  <video
                    src="/videos/hero-reel.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                    poster="/images/hero-banner.jpg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Card flotante de tienda física */}
                <div className="absolute -bottom-6 -left-6 hidden md:block">
                  <div className="rounded-2xl border border-white/10 bg-black/70 backdrop-blur-md p-4 shadow-2xl">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D8071B] text-white shadow-lg shadow-[#D8071B]/40">
                        <Store className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-white/60 uppercase tracking-[0.2em] font-semibold">Tienda física</p>
                        <p className="font-bold text-white text-sm">San Andresito 135</p>
                        <p className="text-xs text-white/50">Santa Marta, Colombia</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badge flotante arriba */}
                <div className="absolute -top-3 -right-3 hidden md:block">
                  <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-xl">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    <span className="text-xs font-bold text-black uppercase tracking-wider">Disponible ahora</span>
                  </div>
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