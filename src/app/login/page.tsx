
'use client'

import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import {Chrome} from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSignIn = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  const handleSignUp = async () => {
    setError(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else if (data.user && data.user.identities && data.user.identities.length === 0) {
       setError("User with this email already exists.")
    }
    else {
      // A confirmation email will be sent.
      alert('Check your email for the confirmation link!')
    }
  }

  const handleSignInWithGoogle = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    })
    if (error) {
      setError(error.message)
    }
  }

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login or create an account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
           <Button variant="outline" onClick={handleSignInWithGoogle}>
            <Chrome className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required onChange={(e) => setEmail(e.target.value)} value={email} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required onChange={(e) => setPassword(e.target.value)} value={password} />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={handleSignIn}>Sign in</Button>
          <Button variant="outline" className="w-full" onClick={handleSignUp}>Sign up</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
