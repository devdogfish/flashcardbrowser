'use client'

import { useState } from 'react'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: '/reset-password',
    })

    if (error) {
      setError(error.message ?? 'Something went wrong.')
    } else {
      setSent(true)
    }

    setPending(false)
  }

  if (sent) {
    return (
      <div className="w-full max-w-sm">
        <div className="bg-card/70 backdrop-blur-md border border-border rounded-2xl p-8 text-center space-y-3">
          <p className="text-lg font-medium">Check your email</p>
          <p className="text-sm text-muted-foreground">
            If an account exists for <span className="text-foreground">{email}</span>, you'll receive a reset link shortly.
          </p>
          <Link
            href="/sign-in"
            className="inline-block text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-card/70 backdrop-blur-md border border-border rounded-2xl p-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">Reset your password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {error && <p className="text-sm text-destructive-foreground bg-destructive/20 border border-destructive/30 rounded-lg px-3 py-2">{error}</p>}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Sending…' : 'Send reset link'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/sign-in" className="text-foreground underline underline-offset-4 hover:no-underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
