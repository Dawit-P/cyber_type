"use client"

import { useState } from "react"
import { useAuth } from "./auth-context-firebase"

export default function Login({ onSwitchToSignup, onSwitchToAdminLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result = login(email, password)
    if (!result.success) {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-2 text-center">
            <span className="text-accent">{"<"}</span>
            Login
            <span className="text-accent">{">"}</span>
          </h1>
          <p className="text-muted-foreground text-center mb-8">Sign in to your account</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-accent transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-accent transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-background font-semibold py-2 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            <button onClick={onSwitchToSignup} className="w-full text-accent hover:underline text-sm font-medium">
              Don't have an account? Sign up
            </button>
            <button
              onClick={onSwitchToAdminLogin}
              className="w-full text-muted-foreground hover:text-foreground text-sm font-medium"
            >
              Admin login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
