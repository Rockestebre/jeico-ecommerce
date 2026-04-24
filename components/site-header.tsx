'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, Shield, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CartButton } from '@/components/cart/cart-button'
import { CartSidebar } from '@/components/cart/cart-sidebar'

export function SiteHeader() {
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isAdmin = session?.user?.role === 'ADMIN'

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          {/* Logo Badge - sobresale de la barra */}
          <Link href="/" className="relative flex-shrink-0 group">
            <div className="relative -my-1 md:-my-2">
              {/* Glow de fondo */}
              <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Contenedor del logo */}
              <div className="relative flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-lg md:rounded-xl bg-primary shadow-md shadow-primary/30 ring-1 ring-primary/20 group-hover:ring-primary/40 group-hover:shadow-primary/50 transition-all duration-300 group-hover:scale-105">
                <Image
                  src="/brand/jeico-logo-new.png"
                  alt="JEICO"
                  fill
                  className="object-contain p-1 md:p-1.5"
                  priority
                  sizes="(max-width: 768px) 40px, 48px"
                />
              </div>
            </div>
            <span className="sr-only">JEICO</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Productos
            </Link>
            <Link href="/products?category=weapons" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Weapons
            </Link>
            <Link href="/products?category=knives" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Knives
            </Link>
            <Link href="/products?category=fishing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Fishing
            </Link>
            <Link href="/products?category=hobbies" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Hobbies
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <CartButton />
            {session?.user ? (
              <div className="hidden md:flex items-center gap-2">
                {isAdmin && (
                  <Link href="/admin/products">
                    <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                      <Shield className="h-4 w-4" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  Salir
                </Button>
              </div>
            ) : (
              <Link href="/login" className="hidden md:block">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <User className="h-4 w-4" />
                  Entrar
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-border/40 bg-background px-4 py-4 space-y-3">
            <Link href="/products" className="block text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>
              Productos
            </Link>
            <Link href="/products?category=weapons" className="block text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>
              Weapons
            </Link>
            <Link href="/products?category=knives" className="block text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>
              Knives
            </Link>
            <Link href="/products?category=fishing" className="block text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>
              Fishing
            </Link>
            <Link href="/products?category=hobbies" className="block text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>
              Hobbies
            </Link>
            {session?.user ? (
              <>
                {isAdmin && (
                  <Link href="/admin/products" className="block text-sm font-medium py-2 text-primary" onClick={() => setMobileOpen(false)}>
                    Panel Admin
                  </Link>
                )}
                <button
                  onClick={() => { signOut({ callbackUrl: '/' }); setMobileOpen(false); }}
                  className="block text-sm font-medium py-2 w-full text-left text-muted-foreground"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link href="/login" className="block text-sm font-medium py-2 text-primary" onClick={() => setMobileOpen(false)}>
                Iniciar sesión
              </Link>
            )}
          </div>
        )}
      </header>
      <CartSidebar />
    </>
  )
}
