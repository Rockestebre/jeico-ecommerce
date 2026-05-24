'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Eye, EyeOff, UserPlus, Shield, Lock, Mail, User, Check, X } from 'lucide-react'
import { toast } from 'sonner'

function getPasswordStrength(password: string) {
  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 10) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { level: 'Débil', color: 'bg-red-500', width: 'w-1/4', textColor: 'text-red-500' }
  if (score <= 2) return { level: 'Regular', color: 'bg-orange-500', width: 'w-2/4', textColor: 'text-orange-500' }
  if (score <= 3) return { level: 'Buena', color: 'bg-yellow-500', width: 'w-3/4', textColor: 'text-yellow-500' }
  return { level: 'Fuerte', color: 'bg-emerald-500', width: 'w-full', textColor: 'text-emerald-500' }
}

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const strength = useMemo(() => getPasswordStrength(password), [password])

  const requirements = [
    { label: 'Mínimo 6 caracteres', met: password.length >= 6 },
    { label: 'Una letra mayúscula', met: /[A-Z]/.test(password) },
    { label: 'Un número', met: /[0-9]/.test(password) },
  ]

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Error al registrarse')
      } else {
        toast.success('¡Cuenta creada exitosamente!')
        router.push('/login')
      }
    } catch {
      toast.error('Error al registrarse')
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
            <h1 className="font-display text-2xl font-bold tracking-tight">Crea tu cuenta</h1>
            <p className="text-sm text-muted-foreground mt-1">Únete a la comunidad JEICO</p>
          </div>
        </div>

        <Card className="border-border/60 shadow-lg">
          <form onSubmit={handleSubmit}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-emerald-600 dark:text-emerald-400">
                <Shield className="h-4 w-4" />
                <span className="text-xs font-medium">Tu información está protegida</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Nombre</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="name" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Barra de fortaleza */}
                {password.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Seguridad:</span>
                      <span className={`text-xs font-medium ${strength.textColor}`}>{strength.level}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                    </div>

                    {/* Requisitos */}
                    <div className="space-y-1 pt-1">
                      {requirements.map((req) => (
                        <div key={req.label} className="flex items-center gap-2">
                          {req.met ? (
                            <Check className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <X className="h-3 w-3 text-muted-foreground/50" />
                          )}
                          <span className={`text-xs ${req.met ? 'text-emerald-500' : 'text-muted-foreground/50'}`}>
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirmar contraseña */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 pr-10" required />
                  {confirmPassword.length > 0 && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {passwordsMatch ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {confirmPassword.length > 0 && !passwordsMatch && (
                  <p className="text-xs text-red-500">Las contraseñas no coinciden</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-2">
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 gap-2 py-5 text-base" loading={isLoading}>
                <UserPlus className="h-4 w-4" />
                Crear cuenta
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className="text-primary font-medium hover:underline">
                  Inicia sesión
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