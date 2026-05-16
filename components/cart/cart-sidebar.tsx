'use client'

import { X, Plus, Minus, ShoppingBag, Trash2, MessageCircle } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useCart } from './cart-context'
import Image from 'next/image'

// 🛠️ Función mágica para formatear el precio con puntos y COP
const formatPrice = (price: number) => {
  return `$${price.toLocaleString('es-CO')} COP`
}

export function CartSidebar() {
  const { items, isOpen, setIsOpen, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex w-full flex-col bg-card sm:max-w-md border-border">
        <SheetHeader className="space-y-2.5 pb-4">
          <SheetTitle className="flex items-center gap-2 text-lg font-display">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Tu Carrito
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-muted-foreground">
            <ShoppingBag className="h-16 w-16 opacity-20" />
            <p className="text-sm">Tu carrito está vacío</p>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Seguir comprando
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {items.map((item) => {
                  // 🛠️ LA MAGIA DE LA IMAGEN: Traducimos el string a array para cada ítem
                  let firstImage = null
                  if (typeof item.product.images === 'string') {
                    try {
                      const parsed = JSON.parse(item.product.images)
                      firstImage = parsed[0]
                    } catch (e) {
                      // Si falla el parseo silenciosamente no se rompe la app
                    }
                  } else if (Array.isArray(item.product.images)) {
                    firstImage = item.product.images[0]
                  }

                  return (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                        {firstImage ? (
                          <Image
                            src={firstImage}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                            }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            <ShoppingBag className="h-6 w-6 opacity-40" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-between py-0.5">
                        <div>
                          <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">{item.product.category?.name}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                item.quantity > 1
                                  ? updateQuantity(item.product.id, item.quantity - 1)
                                  : removeFromCart(item.product.id)
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {/* 🛠️ PRECIO FORMATEADO (Producto x Cantidad) */}
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => removeFromCart(item.product.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4">
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                {/* 🛠️ TOTAL GENERAL FORMATEADO */}
                <span className="text-lg font-bold">{formatPrice(totalPrice)}</span>
              </div>
              <div className="grid gap-2">
                <Button
                  className="w-full bg-[#25D366] hover:bg-[#1fb855] text-white gap-2 text-base py-5"
                  onClick={() => {
                    const formatP = (n: number) => `$${n.toLocaleString('es-CO')} COP`
                    const lines = items.map(
                      (item) =>
                        `${item.quantity}x ${item.product.name} — ${formatP(item.product.price * item.quantity)}`
                    )
                    const msg = [
                      '*Nuevo pedido JEICO*',
                      '',
                      ...lines,
                      '',
                      `*Total: ${formatP(totalPrice)}*`,
                      '',
                      '¡Hola! Quiero hacer este pedido.',
                    ].join('\n')
                    window.open(
                      `https://wa.me/573003320285?text=${encodeURIComponent(msg)}`,
                      '_blank'
                    )
                  }}
                >
                  <MessageCircle className="h-5 w-5" />
                  Pedir por WhatsApp
                </Button>
                <Button variant="outline" size="sm" onClick={clearCart}>
                  Vaciar carrito
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}