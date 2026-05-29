'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Instagram, Store, ChevronLeft, ChevronRight } from 'lucide-react'
import { SafeImage } from '@/components/safe-image'

interface Slide {
  tag: string
  titleJSX: React.ReactNode
  description: string
  cta: string
  ctaLink: string
  image?: string
  video?: string
  bgStyle: string
}

const slides: Slide[] = [
  {
    tag: 'Tienda de Hobbies',
    titleJSX: (
      <>
        <span className="block text-lg md:text-xl font-medium mb-3">
          <span className="hero-highlight-black">Bienvenido</span>
        </span>
        <span className="block text-white">JEICO</span>
        <span className="hero-highlight-white">Store</span>
      </>
    ),
    description: 'Weapons, Knives, Hobbies & Fishing. Todo para tu aventura, supervivencia y pasiones.',
    cta: 'Ver productos',
    ctaLink: '/products',
    video: '/videos/hero-reel.mp4',
    bgStyle: 'bg-slide-red',
  },
  {
    tag: 'Armas traumáticas',
    titleJSX: (
      <>
        <span className="block text-lg md:text-xl font-medium mb-3">
          <span className="hero-highlight-red">Tu línea</span>
        </span>
        <span className="block text-white">De</span>
        <span className="block">
          <span className="block hero-text-red">Defensa</span>
        </span>
      </>
    ),
    description: 'Armas traumáticas con garantía. Protección personal con la calidad que solo JEICO te ofrece.',
    cta: 'Ver Weapons',
    ctaLink: '/products?category=weapons',
    image: '/images/hero-banner.jpg',
    bgStyle: 'bg-slide-dark',
  },
  {
    tag: 'Pesca deportiva',
    titleJSX: (
      <>
        <span className="block text-lg md:text-xl font-medium mb-3">
          <span className="hero-highlight-red">Fishing</span>
        </span>
        <span className="block text-white">Tu día</span>
        <span className="block text-cyan-400">de pesca</span>
      </>
    ),
    description: 'Cañas, carretes, señuelos y todo lo que necesitas para tu próxima jornada. Artículos de pesca de alta calidad.',
    cta: 'Ver Fishing',
    ctaLink: '/products?category=fishing',
    image: '/images/hero-banner.jpg',
    bgStyle: 'bg-slide-ocean',
  },
  {
    tag: 'Nuevos artículos',
    titleJSX: (
      <>
        <span className="block text-lg md:text-xl font-medium mb-3">
          <span className="hero-highlight-red">Equípate</span>
        </span>
        <span className="block text-white">Para la</span>
        <span className="block hero-text-red">Aventura</span>
      </>
    ),
    description: 'Cuchillos tácticos, artículos de pesca y todo lo que necesitas para el outdoor. Envíos a toda Colombia.',
    cta: 'Explorar todo',
    ctaLink: '/products',
    image: '/images/hero-banner.jpg',
    bgStyle: 'bg-slide-light',
  },
]

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.7a8.18 8.18 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.13z" />
    </svg>
  )
}

export function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrent(index)
    setTimeout(() => setIsTransitioning(false), 600)
  }, [isTransitioning])

  const next = useCallback(() => {
    goTo((current + 1) % slides.length)
  }, [current, goTo])

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length)
  }, [current, goTo])

  useEffect(() => {
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next])

  const slide = slides[current]

  return (
    <section className="relative overflow-hidden -mt-px flex items-center min-h-[calc(100vh-4rem)] -mx-px">
      {/* Fondo dinámico por slide */}
      <div key={`bg-${current}`} className={`absolute inset-0 transition-opacity duration-500 ${slide.bgStyle}`} />

      {/* Contenido */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-10 items-center">

          {/* Columna izquierda */}
          <div key={current} className="space-y-6 animate-fade-in">
            {/* Tagline */}
            <div className="inline-flex items-center gap-3 text-xs md:text-sm text-white/70 font-semibold tracking-[0.25em] uppercase">
              <span className="h-px w-10 bg-[#D8071B]" />
              {slide.tag}
            </div>

            {/* Título */}
            <h1 className="font-display font-black tracking-tight uppercase leading-[0.85] text-5xl md:text-7xl lg:text-8xl">
              {slide.titleJSX}
            </h1>

            {/* Descripción */}
            <p className="text-base md:text-lg text-white/70 max-w-md leading-relaxed">
              {slide.description}
            </p>

            {/* CTA + categorías */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <Link href={slide.ctaLink} className="group inline-flex items-center gap-3 rounded-full bg-white pl-6 pr-2 py-2 font-bold text-black shadow-xl transition-transform hover:scale-105">
                <span>{slide.cta}</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D8071B] text-white transition-transform group-hover:rotate-[-45deg]">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </Link>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {['weapons', 'knives', 'fishing', 'hobbies'].map((cat, i) => (
                    <div key={cat} className={`relative h-11 w-11 rounded-full border-2 border-white/15 bg-[#0F0F0F] overflow-hidden shadow-lg ${slide.bgStyle === 'bg-slide-ocean' ? (i === 0 ? 'animate-wave' : i === 1 ? 'animate-wave-delayed' : i === 2 ? 'animate-wave-slow' : 'animate-wave') : ''}`}>
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

            {/* Redes sociales */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs text-white/40 uppercase tracking-[0.2em] font-semibold">Síguenos</span>
              <span className="h-px w-6 bg-white/20" />
              <a href="https://www.instagram.com/jeico.hobbies/" target="_blank" rel="noopener noreferrer" className="text-white/50 transition-colors hover:text-white" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://www.tiktok.com/@jeico_sm?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="text-white/50 transition-colors hover:text-white" aria-label="TikTok">
                <TikTokIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Columna derecha - imagen/video */}
          <div className="relative">
            <div key={current} className="relative mx-auto max-h-[50vh] lg:max-h-[75vh] aspect-[9/16] overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-black animate-fade-in">
              {slide.video ? (
                <video src={slide.video} autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover" poster="/images/hero-banner.jpg" />
              ) : (
                <SafeImage src={slide.image || '/images/hero-banner.jpg'} alt="JEICO" fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 40vw" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Card flotante tienda */}
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

            {/* Badge disponible */}
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
        </div>

        {/* Controles del carrusel */}
        <div className="flex items-center justify-between mt-8 md:mt-10">
          {/* Indicadores */}
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-[#D8071B]' : 'w-4 bg-white/20 hover:bg-white/40'}`} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>

          {/* Flechas */}
          <div className="flex items-center gap-2">
            <button onClick={prev} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/60 transition-all hover:border-white/40 hover:text-white" aria-label="Anterior">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={next} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/60 transition-all hover:border-white/40 hover:text-white" aria-label="Siguiente">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}