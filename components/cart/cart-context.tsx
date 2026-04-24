'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

interface CartItem {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    slug: string
    price: number
    stock: number
    images: string[]
    category: {
      name: string
      slug: string
    }
  }
}

interface CartContextType {
  items: CartItem[]
  isLoading: boolean
  addToCart: (productId: string, quantity: number) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  clearCart: () => Promise<void>
  totalItems: number
  totalPrice: number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const LOCAL_STORAGE_KEY = 'jeico_cart'

function getLocalCart(): { productId: string; quantity: number }[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function setLocalCart(items: { productId: string; quantity: number }[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items))
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const fetchCart = useCallback(async () => {
    if (status === 'loading') return

    if (session?.user) {
      try {
        const res = await fetch('/api/cart')
        if (res.ok) {
          const data = await res.json()
          setItems(data.items || [])
        }
      } catch {
        setItems([])
      }
    } else {
      const localItems = getLocalCart()
      if (localItems.length > 0) {
        try {
          const res = await fetch('/api/products')
          if (res.ok) {
            const products = await res.json()
            const cartItems: CartItem[] = localItems
              .map((localItem) => {
                const product = products.find((p: any) => p.id === localItem.productId)
                if (!product) return null
                return {
                  id: `local-${localItem.productId}`,
                  quantity: localItem.quantity,
                  product,
                }
              })
              .filter((item): item is CartItem => item !== null)
            setItems(cartItems)
          }
        } catch {
          setItems([])
        }
      } else {
        setItems([])
      }
    }
    setIsInitialized(true)
  }, [session, status])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const addToCart = async (productId: string, quantity: number) => {
    setIsLoading(true)
    try {
      if (session?.user) {
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity }),
        })
        if (res.ok) {
          await fetchCart()
          setIsOpen(true)
        }
      } else {
        const localItems = getLocalCart()
        const existingIndex = localItems.findIndex((item) => item.productId === productId)
        if (existingIndex >= 0) {
          localItems[existingIndex].quantity += quantity
        } else {
          localItems.push({ productId, quantity })
        }
        setLocalCart(localItems)
        await fetchCart()
        setIsOpen(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    setIsLoading(true)
    try {
      if (session?.user) {
        const res = await fetch('/api/cart', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity }),
        })
        if (res.ok) await fetchCart()
      } else {
        const localItems = getLocalCart()
        const index = localItems.findIndex((item) => item.productId === productId)
        if (index >= 0) {
          localItems[index].quantity = quantity
          setLocalCart(localItems)
          await fetchCart()
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromCart = async (productId: string) => {
    setIsLoading(true)
    try {
      if (session?.user) {
        const res = await fetch(`/api/cart?productId=${productId}`, { method: 'DELETE' })
        if (res.ok) await fetchCart()
      } else {
        const localItems = getLocalCart().filter((item) => item.productId !== productId)
        setLocalCart(localItems)
        await fetchCart()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = async () => {
    setIsLoading(true)
    try {
      if (session?.user) {
        const res = await fetch('/api/cart', { method: 'DELETE' })
        if (res.ok) await fetchCart()
      } else {
        setLocalCart([])
        await fetchCart()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
