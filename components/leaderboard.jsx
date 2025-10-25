"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export default function Leaderboard({ scores }) {
  if (scores.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground text-lg mb-4">
          No scores yet. Complete a typing test to appear on the leaderboard!
        </p>
      </div>
    )
  }

  const topScores = scores.slice(0, 10)
  const avgWpm = Math.round(scores.reduce((sum, s) => sum + s.wpm, 0) / scores.length)
  const avgAccuracy = Math.round(scores.reduce((sum, s) => sum + s.accuracy, 0) / scores.length)

  // Data for WPM chart
  const wpmChartData = topScores.map((score, idx) => ({
    rank: `#${idx + 1}`,
    wpm: score.wpm,
    username: score.username,
  }))

  // Data for accuracy distribution
  const accuracyRanges = [
    { range: "90-100%", count: scores.filter((s) => s.accuracy >= 90).length },
    { range: "80-89%", count: scores.filter((s) => s.accuracy >= 80 && s.accuracy < 90).length },
    { range: "70-79%", count: scores.filter((s) => s.accuracy >= 70 && s.accuracy < 80).length },
    { range: "<70%", count: scores.filter((s) => s.accuracy < 70).length },
  ]

  const COLORS = ["#fbbf24", "#f97316", "#ef4444", "#6b7280"]

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="text-muted-foreground text-sm mb-2">Total Tests</div>
          <div className="text-3xl font-bold text-accent">{scores.length}</div>
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

      {/* Charts */}
      <div className="grid grid-cols-2 gap-8">
        {/* WPM Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Top 10 WPM Scores</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={wpmChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="rank" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
              <Bar dataKey="wpm" fill="#fbbf24" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Accuracy Distribution */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Accuracy Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={accuracyRanges}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ range, count }) => `${range}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {accuracyRanges.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-6 gap-4 p-6 bg-primary/10 border-b border-border font-semibold">
          <div>Rank</div>
          <div>Username</div>
          <div>WPM</div>
          <div>Accuracy</div>
          <div>Snippet</div>
          <div>Date</div>
        </div>
        <div className="divide-y divide-border">
          {scores.map((score, idx) => (
            <div key={score.id} className="grid grid-cols-6 gap-4 p-6 hover:bg-primary/5 transition-colors">
              <div className="font-bold text-accent">#{idx + 1}</div>
              <div className="font-semibold">{score.username}</div>
              <div className="text-lg font-semibold">{score.wpm}</div>
              <div className="text-lg font-semibold">{score.accuracy}%</div>
              <div className="text-muted-foreground truncate text-sm font-mono">{score.snippet}</div>
              <div className="text-muted-foreground text-sm">{score.timestamp}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
