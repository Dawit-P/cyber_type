"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { 
  saveScore, 
  getAllScores, 
  getUserHistory, 
  getLeaderboard,
  saveCustomTests,
  getCustomTests 
} from "@/lib/firebaseService"

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

// Configuration for Firebase usage
const USE_FIREBASE = true // Set to false to use only localStorage

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tests, setTests] = useState([])
  const [scores, setScores] = useState([])
  const [firebaseEnabled, setFirebaseEnabled] = useState(USE_FIREBASE)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Load user from localStorage
        const savedUser = localStorage.getItem("currentUser")
        const savedIsAdmin = localStorage.getItem("isAdmin")
        
        if (savedUser) {
          setUser(JSON.parse(savedUser))
          setIsAdmin(savedIsAdmin === "true")
        }

        // Load tests
        if (firebaseEnabled) {
          try {
            const firebaseTests = await getCustomTests()
            if (firebaseTests.length > 0) {
              setTests(firebaseTests)
            } else {
              // Fallback to localStorage
              const savedTests = localStorage.getItem("customTests")
              if (savedTests) {
                setTests(JSON.parse(savedTests))
              }
            }
          } catch (error) {
            console.log("Firebase not available, using localStorage")
            setFirebaseEnabled(false)
            const savedTests = localStorage.getItem("customTests")
            if (savedTests) {
              setTests(JSON.parse(savedTests))
            }
          }
        } else {
          const savedTests = localStorage.getItem("customTests")
          if (savedTests) {
            setTests(JSON.parse(savedTests))
          }
        }

        // Load scores
        if (firebaseEnabled) {
          try {
            const firebaseScores = await getAllScores()
            setScores(firebaseScores)
          } catch (error) {
            console.log("Firebase not available, using localStorage")
            setFirebaseEnabled(false)
            const savedScores = localStorage.getItem("typingScores")
            if (savedScores) {
              setScores(JSON.parse(savedScores))
            }
          }
        } else {
          const savedScores = localStorage.getItem("typingScores")
          if (savedScores) {
            setScores(JSON.parse(savedScores))
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        // Fallback to localStorage only
        setFirebaseEnabled(false)
        const savedUser = localStorage.getItem("currentUser")
        const savedIsAdmin = localStorage.getItem("isAdmin")
        const savedTests = localStorage.getItem("customTests")
        const savedScores = localStorage.getItem("typingScores")
        
        if (savedUser) {
          setUser(JSON.parse(savedUser))
          setIsAdmin(savedIsAdmin === "true")
        }
        if (savedTests) {
          setTests(JSON.parse(savedTests))
        }
        if (savedScores) {
          setScores(JSON.parse(savedScores))
        }
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [firebaseEnabled])

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

  const updateTests = async (newTests) => {
    setTests(newTests)
    localStorage.setItem("customTests", JSON.stringify(newTests))
    
    if (firebaseEnabled && isAdmin) {
      try {
        await saveCustomTests(newTests, user?.email || "admin")
      } catch (error) {
        console.error("Error saving tests to Firebase:", error)
      }
    }
  }

  const saveScoreToStorage = async (scoreData) => {
    const updatedScores = [...scores, scoreData].sort((a, b) => b.wpm - a.wpm)
    setScores(updatedScores)
    localStorage.setItem("typingScores", JSON.stringify(updatedScores))
    
    if (firebaseEnabled) {
      try {
        await saveScore(scoreData)
      } catch (error) {
        console.error("Error saving score to Firebase:", error)
      }
    }
  }

  const logout = () => {
    setUser(null)
    setIsAdmin(false)
    localStorage.removeItem("currentUser")
    localStorage.removeItem("isAdmin")
  }

  const toggleFirebase = () => {
    setFirebaseEnabled(!firebaseEnabled)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAdmin, 
      loading, 
      signup, 
      login, 
      adminLogin, 
      logout, 
      tests, 
      updateTests,
      scores,
      saveScoreToStorage,
      firebaseEnabled,
      toggleFirebase
    }}>
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
