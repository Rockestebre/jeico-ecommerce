'use client'

import Image from 'next/image'
import { Crosshair, Swords, Gamepad2, Fish } from 'lucide-react'

// Mapeo del identificador de icono (ya sea slug como 'weapons' o el nombre antiguo
// de Lucide como 'Crosshair') a la imagen real del brandbook.
const brandIconMap: Record<string, string> = {
  // Slugs de las 4 categorías oficiales
  weapons: '/brand/icon-weapons.png',
  knives: '/brand/icon-knives.png',
  hobbies: '/brand/icon-hobbies.png',
  fishing: '/brand/icon-fishing.png',
  // Compatibilidad con nombres antiguos (Lucide) almacenados en la DB
  Crosshair: '/brand/icon-weapons.png',
  Swords: '/brand/icon-knives.png',
  Gamepad2: '/brand/icon-hobbies.png',
  Fish: '/brand/icon-fishing.png',
}

// Fallback de iconos Lucide (por si aparece un icon no mapeado)
const lucideFallback: Record<string, React.ComponentType<{ className?: string }>> = {
  Crosshair,
  Swords,
  Gamepad2,
  Fish,
}

interface CategoryIconProps {
  icon: string
  className?: string
}

/**
 * Renderiza el icono oficial de la categoría Jeico.
 * Acepta tanto el slug ('weapons', 'knives', etc.) como el nombre antiguo de Lucide.
 */
export function CategoryIcon({ icon, className }: CategoryIconProps) {
  const imageSrc = brandIconMap[icon]

  if (imageSrc) {
    return (
      <span className={`relative inline-block ${className ?? ''}`}>
        <Image
          src={imageSrc}
          alt={`Categoría ${icon}`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 64px, 96px"
        />
      </span>
    )
  }

  const Fallback = lucideFallback[icon] || Crosshair
  return <Fallback className={className} />
}
