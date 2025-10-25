"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-context"
import Login from "@/components/login"
import Signup from "@/components/signup"
import AdminLogin from "@/components/admin-login"
import TypingTest from "@/components/typing-test"
import Leaderboard from "@/components/leaderboard"
import AdminPanel from "@/components/admin-panel"
import CyberAwareness from "@/components/cyber-awareness"

export default function Home() {
  const { user, isAdmin, loading, logout, tests, updateTests } = useAuth()
  const [authPage, setAuthPage] = useState("login")
  const [activeTab, setActiveTab] = useState("test")
  const [scores, setScores] = useState([])
  const [showAwareness, setShowAwareness] = useState(false)
  const [currentSnippet, setCurrentSnippet] = useState("")
  const [showEducation, setShowEducation] = useState(false)

  useEffect(() => {
    const savedScores = localStorage.getItem("typingScores")
    if (savedScores) {
      setScores(JSON.parse(savedScores))
    }
  }, [])

  const handleScoreSaved = (newScore: any) => {
    const updatedScores = [...scores, newScore].sort((a, b) => b.wpm - a.wpm)
    setScores(updatedScores)
    localStorage.setItem("typingScores", JSON.stringify(updatedScores))
  }

  const handleStartTest = (snippet: string) => {
    setCurrentSnippet(snippet)
    setShowAwareness(true)
  }

  const handleCloseAwareness = () => {
    setShowAwareness(false)
  }

  const handleShowEducation = () => {
    setShowEducation(true)
    setActiveTab("education")
  }

  const handleCloseEducation = () => {
    setShowEducation(false)
    setActiveTab("test")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-accent mb-2">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    if (authPage === "signup") {
      return <Signup onSwitchToLogin={() => setAuthPage("login")} />
    }
    if (authPage === "admin-login") {
      return <AdminLogin onSwitchToLogin={() => setAuthPage("login")} />
    }
    return (
      <Login onSwitchToSignup={() => setAuthPage("signup")} onSwitchToAdminLogin={() => setAuthPage("admin-login")} />
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl font-bold text-accent">⚡</span>
              <h1 className="text-4xl font-bold text-accent">Threat X</h1>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Python Typing Test</h2>
            <p className="text-muted-foreground text-lg">
              {isAdmin ? "Admin Dashboard" : "Master your Python coding speed and compete on the leaderboard"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-2">{isAdmin ? "Admin" : user.username || user.email}</p>
            <button
              onClick={logout}
              className="px-4 py-2 bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-colors text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-border">
          {isAdmin ? (
            <>
              <button
                onClick={() => setActiveTab("manage")}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === "manage"
                    ? "text-accent border-b-2 border-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Manage Tests
              </button>
              <button
                onClick={() => setActiveTab("leaderboard")}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === "leaderboard"
                    ? "text-accent border-b-2 border-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Leaderboard
              </button>
              <button
                onClick={handleShowEducation}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === "education"
                    ? "text-accent border-b-2 border-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🛡️ Cybersecurity Education
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab("test")}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === "test"
                    ? "text-accent border-b-2 border-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Typing Test
              </button>
              <button
                onClick={() => setActiveTab("leaderboard")}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === "leaderboard"
                    ? "text-accent border-b-2 border-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Leaderboard
              </button>
              <button
                onClick={handleShowEducation}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === "education"
                    ? "text-accent border-b-2 border-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🛡️ Cybersecurity Education
              </button>
            </>
          )}
        </div>

        {/* Content */}
        <div className="animate-in fade-in">
          {isAdmin ? (
            activeTab === "manage" ? (
              <AdminPanel onTestsUpdate={updateTests} tests={tests} scores={scores} />
            ) : activeTab === "education" ? (
              <CyberAwareness 
                currentSnippet="" 
                onClose={handleCloseEducation} 
              />
            ) : (
              <Leaderboard scores={scores} />
            )
          ) : activeTab === "test" ? (
            showAwareness ? (
              <CyberAwareness 
                currentSnippet={currentSnippet} 
                onClose={handleCloseAwareness} 
              />
            ) : (
              <TypingTest 
                onScoreSaved={handleScoreSaved} 
                tests={tests} 
                onStartTest={handleStartTest}
                autoStart={!showAwareness}
              />
            )
          ) : activeTab === "education" ? (
            <CyberAwareness 
              currentSnippet="" 
              onClose={handleCloseEducation} 
            />
          ) : (
            <Leaderboard scores={scores} />
          )}
        </div>

        <div className="mt-16 pt-8 border-t border-border text-center text-muted-foreground text-sm">
          <p>Threat X - Master Your Coding Speed</p>
        </div>
      </div>
    </main>
  )
}