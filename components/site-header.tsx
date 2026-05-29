'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, Shield, LogOut, User, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CartButton } from '@/components/cart/cart-button'
import { CartSidebar } from '@/components/cart/cart-sidebar'

const navLinks = [
  { name: 'Productos', href: '/products' },
  { name: 'Weapons', href: '/products?category=weapons' },
  { name: 'Knives', href: '/products?category=knives' },
  { name: 'Fishing', href: '/products?category=fishing' },
  { name: 'Hobbies', href: '/products?category=hobbies' },
]

export function SiteHeader() {
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isAdmin = session?.user?.role === 'ADMIN'

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#0F0F0F] border-b border-white/5">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">

          {/* Logo + nombre */}
          <Link href="/" className="group flex items-center gap-3 flex-shrink-0">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-[#D8071B] shadow-lg shadow-[#D8071B]/20 transition-transform group-hover:scale-105">
              <Image src="/brand/jeico-logo-new.png" alt="JEICO" fill className="object-contain p-1" priority sizes="36px" />
            </div>
            <span className="hidden sm:block font-display text-base font-bold tracking-wider text-white uppercase">JEICO</span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="px-3 py-1.5 text-sm font-medium text-white/60 uppercase tracking-wider transition-colors hover:text-white relative group">
                {link.name}
                <span className="absolute bottom-0 left-3 right-3 h-px bg-[#D8071B] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}
          </nav>

          {/* Acciones */}
          <div className="flex items-center gap-1">
            <CartButton />
            {session?.user ? (
              <div className="hidden md:flex items-center gap-1">
                {isAdmin && (
                  <Link href="/admin/products">
                    <Button variant="ghost" size="sm" className="gap-1.5 text-white/60 hover:text-white hover:bg-white/5">
                      <Shield className="h-4 w-4" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: '/' })} className="gap-1.5 text-white/60 hover:text-white hover:bg-white/5">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link href="/login" className="hidden md:block">
                <Button size="sm" className="bg-[#D8071B] hover:bg-[#B8102F] text-white gap-1.5 text-xs uppercase tracking-wider">
                  <User className="h-3.5 w-3.5" />
                  Entrar
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="icon" className="md:hidden text-white/80 hover:text-white hover:bg-white/5" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Menú móvil */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#0F0F0F] px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="flex items-center justify-between py-3 text-sm font-medium text-white/70 uppercase tracking-wider hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>
                {link.name}
                <ChevronRight className="h-4 w-4 text-white/20" />
              </Link>
            ))}
            <div className="border-t border-white/5 pt-3 mt-2">
              {session?.user ? (
                <>
                  {isAdmin && (
                    <Link href="/admin/products" className="flex items-center gap-2 py-3 text-sm font-medium text-[#D8071B] uppercase tracking-wider" onClick={() => setMobileOpen(false)}>
                      <Shield className="h-4 w-4" />
                      Panel Admin
                    </Link>
                  )}
                  <button onClick={() => { signOut({ callbackUrl: '/' }); setMobileOpen(false); }} className="flex items-center gap-2 py-3 text-sm font-medium text-white/50 uppercase tracking-wider w-full text-left">
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <Link href="/login" className="flex items-center gap-2 py-3 text-sm font-medium text-[#D8071B] uppercase tracking-wider" onClick={() => setMobileOpen(false)}>
                  <User className="h-4 w-4" />
                  Iniciar sesión
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
      <CartSidebar />
    </>
  )
}