'use client'

import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from './cart-context'

export function CartButton() {
  const { totalItems, setIsOpen } = useCart()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative text-foreground hover:text-primary"
      onClick={() => setIsOpen(true)}
    >
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Button>
  )
}
