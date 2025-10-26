"use client"

import { useAuth } from "./auth-context-firebase"
import { useState, useEffect } from "react"

export default function History({ scores }) {
  const { user } = useAuth()
  const [userHistory, setUserHistory] = useState([])

  useEffect(() => {
    if (user && scores) {
      const currentUser = user.username || user.email
      const filteredScores = scores.filter((score) => score.username === currentUser)
      setUserHistory(filteredScores)
    }
  }, [scores, user])

  if (!user) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground text-lg">Please log in to view your history</p>
      </div>
    )
  }

  if (userHistory.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground text-lg mb-4">No history yet.</p>
        <p className="text-muted-foreground">Complete your first typing test to see your progress here!</p>
      </div>
    )
  }

  // Find personal best
  const personalBest = userHistory.reduce((best, score) => (score.wpm > best.wpm ? score : best), userHistory[0])
  const totalTests = userHistory.length
  const avgWpm = Math.round(userHistory.reduce((sum, s) => sum + s.wpm, 0) / totalTests)
  const avgAccuracy = Math.round(userHistory.reduce((sum, s) => sum + s.accuracy, 0) / totalTests)

  return (
    <div className="space-y-8">
      {/* Personal Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="text-muted-foreground text-sm mb-2">Personal Best</div>
          <div className="text-3xl font-bold text-accent">{personalBest.wpm} WPM</div>
          <div className="text-xs text-muted-foreground mt-1">{personalBest.accuracy}% accuracy</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="text-muted-foreground text-sm mb-2">Total Tests</div>
          <div className="text-3xl font-bold text-accent">{totalTests}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="text-muted-foreground text-sm mb-2">Average WPM</div>
          <div className="text-3xl font-bold">{avgWpm}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="text-muted-foreground text-sm mb-2">Average Accuracy</div>
          <div className="text-3xl font-bold">{avgAccuracy}%</div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-6 gap-4 p-6 bg-primary/10 border-b border-border font-semibold">
          <div>#</div>
          <div>WPM</div>
          <div>Accuracy</div>
          <div>Attack Type</div>
          <div>Date</div>
          <div>Status</div>
        </div>
        <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
          {userHistory
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map((score, idx) => (
              <div
                key={score.id}
                className={`grid grid-cols-6 gap-4 p-6 hover:bg-primary/5 transition-colors ${
                  score.id === personalBest.id ? "bg-accent/10" : ""
                }`}
              >
                <div className="font-bold text-accent">#{idx + 1}</div>
                <div className="text-lg font-semibold">{score.wpm}</div>
                <div className="text-lg font-semibold">{score.accuracy}%</div>
                <div className="text-muted-foreground truncate text-sm font-mono">{score.snippet}</div>
                <div className="text-muted-foreground text-sm">{score.timestamp}</div>
                <div>
                  {score.id === personalBest.id ? (
                    <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-semibold">
                      🏆 Best
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs">-</span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Progress Over Time</h3>
        <div className="space-y-2">
          {userHistory
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
            .map((score, idx) => (
              <div key={score.id} className="flex items-center gap-4">
                <div className="w-16 text-xs text-muted-foreground">
                  #{idx + 1}
                </div>
                <div className="flex-1 bg-muted h-8 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-accent/70 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                    style={{ width: `${(score.wpm / personalBest.wpm) * 100}%` }}
                  >
                    <span className="text-xs font-bold text-white">{score.wpm}</span>
                  </div>
                </div>
                <div className="w-20 text-right text-sm font-semibold">{score.accuracy}%</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
