'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Eye, EyeOff, LogIn, Shield, Lock, Mail } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Email o contraseña incorrectos')
      } else {
        toast.success('¡Bienvenido!')
        router.push('/')
        router.refresh()
      }
    } catch {
      toast.error('Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-muted/30">
      <div className="w-full max-w-md space-y-6">

        {/* Logo y título */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block">
            <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30 ring-1 ring-primary/20">
              <Image src="/brand/jeico-logo-new.png" alt="JEICO" fill className="object-contain p-2" sizes="56px" />
            </div>
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Bienvenido de nuevo</h1>
            <p className="text-sm text-muted-foreground mt-1">Inicia sesión en tu cuenta JEICO</p>
          </div>
        </div>

        <Card className="border-border/60 shadow-lg">
          <form onSubmit={handleSubmit}>
            <CardHeader className="pb-4">
              {/* Badge de seguridad */}
              <div className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-emerald-600 dark:text-emerald-400">
                <Shield className="h-4 w-4" />
                <span className="text-xs font-medium">Conexión segura y protegida</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-2">
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 gap-2 py-5 text-base" loading={isLoading}>
                <LogIn className="h-4 w-4" />
                Iniciar sesión
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                ¿No tienes cuenta?{' '}
                <Link href="/signup" className="text-primary font-medium hover:underline">
                  Crea una aquí
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        {/* Texto de confianza */}
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Datos encriptados
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Compra segura
          </span>
        </div>

      </div>
    </div>
  )
}