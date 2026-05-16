import { prisma } from '@/lib/db'
import type { Metadata } from 'next'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findFirst({
    where: {
      OR: [{ slug: params.id }, { id: params.id }],
    },
    include: { category: true },
  })

  if (!product) {
    return { title: 'Producto no encontrado' }
  }

  let images: string[] = []
  try {
    const parsed = JSON.parse(product.images)
    images = Array.isArray(parsed) ? parsed : []
  } catch {
    images = []
  }

  const ogImage = images[0]
    ? `https://jeico.store${images[0]}`
    : 'https://jeico.store/brand/jeico-logo-new.png'

  const price = `$${product.price.toLocaleString('es-CO', { maximumFractionDigits: 0 })} COP`

  return {
    title: product.name,
    description: product.description || `${product.name} — ${price}. Disponible en JEICO. Envíos a toda Colombia.`,
    openGraph: {
      title: `${product.name} — ${price}`,
      description:
        product.description || `Disponible en JEICO. ${product.category?.name}. Envíos a toda Colombia.`,
      images: [{ url: ogImage, width: 800, height: 800, alt: product.name }],
      type: 'website',
      locale: 'es_CO',
      url: `https://jeico.store/products/${product.slug}`,
      siteName: 'JEICO',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} — ${price}`,
      description:
        product.description || `Disponible en JEICO. Envíos a toda Colombia.`,
      images: [ogImage],
    },
  }
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}