"use client"

import { useState } from "react"

export default function AdminPanel({ onTestsUpdate, tests, scores }) {
  const [newTest, setNewTest] = useState("")
  const [error, setError] = useState("")

  const handleAddTest = () => {
    if (!newTest.trim()) {
      setError("Test code cannot be empty")
      return
    }
    if (newTest.length < 10) {
      setError("Test code must be at least 10 characters")
      return
    }
    const updatedTests = [...tests, newTest]
    onTestsUpdate(updatedTests)
    setNewTest("")
    setError("")
  }

  const handleDeleteTest = (index) => {
    const updatedTests = tests.filter((_, i) => i !== index)
    onTestsUpdate(updatedTests)
  }

  return (
    <div className="space-y-8">
      {/* Add Test Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Add New Test</h3>
        <div className="space-y-4">
          <textarea
            value={newTest}
            onChange={(e) => setNewTest(e.target.value)}
            placeholder="Paste Python code here..."
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-accent transition-colors font-mono text-sm h-32 resize-none"
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            onClick={handleAddTest}
            className="px-6 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Add Test
          </button>
        </div>
      </div>

      {/* Tests List */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Manage Tests ({tests.length})</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {tests.length === 0 ? (
            <p className="text-muted-foreground">No custom tests added yet.</p>
          ) : (
            tests.map((test, idx) => (
              <div
                key={idx}
                className="bg-background border border-border rounded-lg p-4 flex justify-between items-start gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono text-muted-foreground truncate">{test.substring(0, 100)}...</p>
                </div>
                <button
                  onClick={() => handleDeleteTest(idx)}
                  className="px-3 py-1 bg-destructive/20 text-destructive rounded hover:bg-destructive/30 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Leaderboard Stats */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Leaderboard Stats</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="text-muted-foreground text-sm mb-2">Total Tests Completed</div>
            <div className="text-2xl font-bold text-accent">{scores.length}</div>
          </div>
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="text-muted-foreground text-sm mb-2">Highest WPM</div>
            <div className="text-2xl font-bold">{scores.length > 0 ? Math.max(...scores.map((s) => s.wpm)) : 0}</div>
          </div>
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="text-muted-foreground text-sm mb-2">Unique Users</div>
            <div className="text-2xl font-bold">{new Set(scores.map((s) => s.username)).size}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
