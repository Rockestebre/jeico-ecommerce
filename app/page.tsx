import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product-card'
import { FadeIn } from '@/components/ui/animate'
import { ArrowRight, Shield, Truck, Headphones, ChevronRight, Crosshair, Mountain } from 'lucide-react'
import { HeroCarousel } from '@/components/hero-carousel'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      include: { category: true },
      take: 8,
    }),
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    }),
  ])

  const formattedProducts = featuredProducts.map((p: any) => ({
    ...p,
    price: Number(p.price),
    images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
  }))

  return (
    <div>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* ¿Qué estás buscando? */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <FadeIn>
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl text-center uppercase mb-10">
            ¿Qué estás buscando?
          </h2>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <FadeIn delay={0.1}>
            <Link href="/products?category=weapons" className="group relative block overflow-hidden rounded-2xl h-52 md:h-64">
              <div className="absolute inset-0 bg-[#1A1A1A] border border-white/10 rounded-2xl" />
              <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(148deg, transparent 30%, rgba(216, 7, 27, 0.15) 30%, rgba(216, 7, 27, 0.15) 30.15%, transparent 30.15%), linear-gradient(148deg, transparent 65%, rgba(216, 7, 27, 0.08) 65%, rgba(216, 7, 27, 0.08) 65.15%, transparent 65.15%)' }} />
              <div className="relative h-full flex items-center justify-between p-6 md:p-8">
                <div className="space-y-2">
                  <span className="text-xs text-white/50 uppercase tracking-[0.2em] font-semibold">Weapons & Knives</span>
                  <h3 className="font-display text-2xl md:text-3xl font-black text-white uppercase">Defensa<br />personal</h3>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D8071B] text-white transition-transform group-hover:scale-110 group-hover:rotate-[-10deg] shadow-lg shadow-[#D8071B]/30">
                  <Crosshair className="h-6 w-6" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D8071B]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </FadeIn>
          <FadeIn delay={0.2}>
            <Link href="/products" className="group relative block overflow-hidden rounded-2xl h-52 md:h-64">
              <div className="absolute inset-0 bg-[#1A1A1A] border border-white/10 rounded-2xl" />
              <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(150deg, rgba(216, 7, 27, 0.15) 0.5px, transparent 0.5px), linear-gradient(210deg, rgba(216, 7, 27, 0.1) 0.5px, transparent 0.5px), linear-gradient(150deg, transparent 35%, rgba(216, 7, 27, 0.1) 35%, rgba(216, 7, 27, 0.1) 35.15%, transparent 35.15%)', backgroundSize: '35px 35px, 50px 50px, 100% 100%' }} />
              <div className="relative h-full flex items-center justify-between p-6 md:p-8">
                <div className="space-y-2">
                  <span className="text-xs text-white/50 uppercase tracking-[0.2em] font-semibold">Fishing & Hobbies</span>
                  <h3 className="font-display text-2xl md:text-3xl font-black text-white uppercase">Outdoor<br />& aventura</h3>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D8071B] text-white transition-transform group-hover:scale-110 group-hover:rotate-[-10deg] shadow-lg shadow-[#D8071B]/30">
                  <Mountain className="h-6 w-6" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D8071B]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Categorías */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-20">
        <FadeIn>
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl uppercase mb-10">
            Categorías
          </h2>
        </FadeIn>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category, i) => (
            <FadeIn key={category.id} delay={i * 0.1}>
              <Link href={`/products?category=${category.slug}`} className="group relative block overflow-hidden rounded-2xl h-44 md:h-52 border border-white/5 transition-all hover:border-white/15">
                <Image src={`/images/cat-${category.slug}.jpg`} alt={category.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width: 768px) 50vw, 25vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="relative h-full flex flex-col justify-end p-5">
                  <h3 className="font-display text-lg font-bold text-white uppercase">{category.name}</h3>
                  <p className="text-xs text-white/50 mt-1">{(category as any)._count?.products || 0} productos</p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Productos populares */}
      {formattedProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-20">
          <FadeIn>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl uppercase">
                  Productos populares
                </h2>
                <p className="mt-2 text-muted-foreground text-sm">
                  Los más buscados por nuestros clientes
                </p>
              </div>
              <Link href="/products">
                <Button variant="outline" size="sm" className="gap-1 text-xs uppercase tracking-wider border-white/10 hover:border-[#D8071B]/50 hover:text-[#D8071B]">
                  Ver todo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </FadeIn>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:overflow-visible">
            {formattedProducts.map((product) => (
              <div key={product.id} className="min-w-[260px] snap-start md:min-w-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Shield, title: 'Garantía de calidad', desc: 'Todos nuestros productos son verificados y cuentan con garantía.' },
            { icon: Truck, title: 'Envíos a toda Colombia', desc: 'Entregamos en todo el país con los mejores tiempos de envío.' },
            { icon: Headphones, title: 'Soporte especializado', desc: 'Nuestro equipo conoce cada producto y te asesora personalmente.' },
          ].map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 0.1}>
              <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#D8071B]/10 text-[#D8071B]">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display font-bold text-sm uppercase tracking-wider">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ¿Por qué JEICO? */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-20">
        <FadeIn>
          <div className="rounded-2xl overflow-hidden border border-white/5">
            <div className="bg-[#1A1A1A] p-8 md:p-12">
              <div className="grid gap-8 md:grid-cols-2 items-center">
                <div className="space-y-4">
                  <span className="text-xs text-[#D8071B] uppercase tracking-[0.2em] font-semibold">¿Por qué elegirnos?</span>
                  <h2 className="font-display text-2xl md:text-3xl font-black uppercase leading-tight">
                    No somos una tienda más.<br />
                    <span className="text-[#D8071B]">Somos JEICO.</span>
                  </h2>
                  <p className="text-sm text-white/60 leading-relaxed max-w-md">
                    Tienda física en Santa Marta con envíos a toda Colombia. Cada producto es seleccionado y verificado por nuestro equipo.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-[#0F0F0F] border border-white/5 p-5 text-center">
                    <p className="font-display text-3xl md:text-4xl font-black text-[#D8071B]">4</p>
                    <p className="text-xs text-white/50 uppercase tracking-wider mt-1">Categorías</p>
                  </div>
                  <div className="rounded-xl bg-[#0F0F0F] border border-white/5 p-5 text-center">
                    <p className="font-display text-3xl md:text-4xl font-black text-[#D8071B]">100%</p>
                    <p className="text-xs text-white/50 uppercase tracking-wider mt-1">Originales</p>
                  </div>
                  <div className="rounded-xl bg-[#0F0F0F] border border-white/5 p-5 text-center">
                    <p className="font-display text-3xl md:text-4xl font-black text-white">24h</p>
                    <p className="text-xs text-white/50 uppercase tracking-wider mt-1">Despacho</p>
                  </div>
                  <div className="rounded-xl bg-[#0F0F0F] border border-white/5 p-5 text-center">
                    <p className="font-display text-3xl md:text-4xl font-black text-white">COL</p>
                    <p className="text-xs text-white/50 uppercase tracking-wider mt-1">Envío nacional</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  )
}