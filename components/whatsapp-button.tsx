'use client'

import { MessageCircle } from 'lucide-react'

export function WhatsAppButton() {
  return (
    <a href="https://wa.me/573003320285?text=%C2%A1Hola%20JEICO!%20Quiero%20información" target="_blank" rel="noopener noreferrer" className="fixed bottom-12 right-12 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-transform hover:scale-110 active:scale-95" aria-label="Escríbenos por WhatsApp">
      <MessageCircle className="h-7 w-7" />
    </a>
  )
}