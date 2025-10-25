"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

// Simple encryption/decryption for demo purposes
const encryptPassword = (password) => {
  return btoa(password) // Base64 encoding (not production-grade)
}

const decryptPassword = (encrypted) => {
  return atob(encrypted)
}

// Hardcoded admin password (encrypted)
const ADMIN_PASSWORD_ENCRYPTED = encryptPassword("admin123")

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tests, setTests] = useState([]) // Added tests state

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    const savedIsAdmin = localStorage.getItem("isAdmin")
    const savedTests = localStorage.getItem("customTests")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsAdmin(savedIsAdmin === "true")
    }
    if (savedTests) {
      setTests(JSON.parse(savedTests))
    }
    setLoading(false)
  }, [])

  const signup = (email, password, username) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    if (users.find((u) => u.email === email)) {
      return { success: false, error: "Email already exists" }
    }
    const newUser = { email, password: encryptPassword(password), username }
    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))
    setUser(newUser)
    localStorage.setItem("currentUser", JSON.stringify(newUser))
    setIsAdmin(false)
    return { success: true }
  }

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find((u) => u.email === email && decryptPassword(u.password) === password)
    if (!user) {
      return { success: false, error: "Invalid email or password" }
    }
    setUser(user)
    localStorage.setItem("currentUser", JSON.stringify(user))
    setIsAdmin(false)
    return { success: true }
  }

  const adminLogin = (password) => {
    if (decryptPassword(ADMIN_PASSWORD_ENCRYPTED) === password) {
      const adminUser = { email: "admin@typing-test.com", username: "Admin" }
      setUser(adminUser)
      setIsAdmin(true)
      localStorage.setItem("currentUser", JSON.stringify(adminUser))
      localStorage.setItem("isAdmin", "true")
      return { success: true }
    }
    return { success: false, error: "Invalid admin password" }
  }

  const updateTests = (newTests) => {
    setTests(newTests)
    localStorage.setItem("customTests", JSON.stringify(newTests))
  }

  const logout = () => {
    setUser(null)
    setIsAdmin(false)
    localStorage.removeItem("currentUser")
    localStorage.removeItem("isAdmin")
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signup, login, adminLogin, logout, tests, updateTests }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
