'use client'

import Image, { ImageProps } from 'next/image'

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackClassName?: string
}

export function SafeImage({ fallbackClassName, ...props }: SafeImageProps) {
  return (
    <Image
      {...props}
      onError={(e) => {
        const target = e.target as HTMLImageElement
        target.style.display = 'none'
      }}
    />
  )
}
