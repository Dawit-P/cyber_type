"use client"

import { useState } from "react"
import { useAuth } from "./auth-context"

export default function AdminLogin({ onSwitchToLogin }) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { adminLogin } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result = adminLogin(password)
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
            Admin Login
            <span className="text-accent">{">"}</span>
          </h1>
          <p className="text-muted-foreground text-center mb-8">Admin access only</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Admin Password</label>
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
              {loading ? "Verifying..." : "Admin Login"}
            </button>
          </form>

          <div className="mt-6">
            <button onClick={onSwitchToLogin} className="w-full text-accent hover:underline text-sm font-medium">
              Back to user login
            </button>
          </div>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              Demo password: <span className="text-accent font-mono">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
