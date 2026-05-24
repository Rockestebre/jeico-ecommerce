import Link from 'next/link'
import Image from 'next/image'
import { MessageCircle, MapPin, Instagram, Shield, Truck, Store } from 'lucide-react'

const categories = [
  { name: 'Weapons', href: '/products?category=weapons' },
  { name: 'Knives', href: '/products?category=knives' },
  { name: 'Fishing', href: '/products?category=fishing' },
  { name: 'Hobbies', href: '/products?category=hobbies' },
]

const links = [
  { name: 'Todos los productos', href: '/products' },
  { name: 'Iniciar sesión', href: '/login' },
  { name: 'Crear cuenta', href: '/signup' },
]

const badges = [
  { icon: Shield, label: 'Compra segura' },
  { icon: Store, label: 'Tienda física' },
  { icon: Truck, label: 'Envíos a toda Colombia' },
]

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.7a8.18 8.18 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.13z" />
    </svg>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 bg-background">
      {/* Badges de confianza */}
      <div className="border-b border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {badges.map((badge) => (
              <div key={badge.label} className="flex items-center justify-center gap-3 rounded-lg bg-background/60 px-4 py-3">
                <badge.icon className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm font-medium">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-md shadow-primary/30">
                <Image src="/brand/jeico-logo-new.png" alt="JEICO" fill className="object-contain p-1.5" sizes="40px" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight">JEICO</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tu tienda de artículos outdoor, supervivencia, armas traumáticas, cuchillos, pesca y hobbies. Envíos a toda Colombia.
            </p>
          </div>

          {/* Categorías */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Categorías
            </h3>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.name}>
                  <Link href={cat.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Enlaces */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Mi cuenta
            </h3>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="https://wa.me/573003320285" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-[#25D366]">
                  <MessageCircle className="h-4 w-4" />
                  +57 300 332 0285
                </a>
              </li>
              <li>
                <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  San Andresito Local 135, Santa Marta, Colombia
                </span>
              </li>
            </ul>

            {/* Redes sociales */}
            <div className="flex items-center gap-3 pt-2">
              <a href="https://wa.me/573003320285" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-[#25D366] hover:text-white" aria-label="WhatsApp">
                <MessageCircle className="h-4 w-4" />
              </a>
              <a href="https://www.instagram.com/jeico.hobbies/" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-[#E4405F] hover:text-white" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://www.tiktok.com/@jeico_sm?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-black hover:text-white" aria-label="TikTok">
                <TikTokIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-border/40 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} JEICO. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}