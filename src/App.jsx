import React, { useEffect, useState } from 'react'
  import useEvent from './hooks/useEvent.js'
import { connectToServer } from './lib/connect.js'

export default function App() {
  const [serverUrl, setServerUrl] = useState('https://chat.example.com')
  const [roomId, setRoomId] = useState('general')
  const [username, setUsername] = useState('Guest')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [messages, setMessages] = useState([])

  // Non-reactive side work (analytics/logging) extracted as an Effect Event
  const logAnalytics = useEvent(() => {
    // Always sees the latest username/roomId values, but does not cause effect re-runs
    console.log(`📊 Analytics: ${username} joined room "${roomId}"`)
  })

  // Reactive synchronization with the external system (server connection)
  useEffect(() => {
    logAnalytics() // Non-reactive work inside an effect
    const disconnect = connectToServer(serverUrl, roomId, (msg) => {
      // handler is non-reactive; it will always see fresh state via useEvent if we want
      setMessages((m) => [...m, msg])
    })
    return () => disconnect()
  }, [serverUrl, roomId])

  // Another Effect Event to read the freshest state when a condition flips
  const greetUser = useEvent(() => {
    console.log(`👋 Welcome, ${username}!`)
    document.title = `Hello, ${username}`
  })

  useEffect(() => {
    if (isLoggedIn) {
      greetUser() // depends only on isLoggedIn, but reads latest username
    } else {
      document.title = 'React 19 – Separating Events from Effects'
    }
  }, [isLoggedIn])

  // Event handlers (user-driven logic)
  function handleJoin() {
    setIsLoggedIn(true)
  }
  function handleLeave() {
    setIsLoggedIn(false)
  }

  // For demonstration: intentionally "expensive" non-reactive code we don't want as a dependency
  const exportLog = useEvent(() => {
    const blob = new Blob([messages.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-${roomId}.log`
    a.click()
    URL.revokeObjectURL(url)
  })

  return (
    <div className="container">
      <header className="header">
        <h1>React 19 – Separating Events from Effects</h1>
        <p className="subtitle">Event Handlers vs Effects vs Effect Events</p>
      </header>

      <section className="panel">
        <h2>Configuration</h2>
        <div className="grid">
          <label className="field">
            <span>Server URL</span>
            <input
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              placeholder="https://chat.example.com"
            />
          </label>
          <label className="field">
            <span>Room ID</span>
            <input
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="general"
            />
          </label>
          <label className="field">
            <span>Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Guest"
            />
          </label>
        </div>

        <div className="actions">
          <button onClick={handleJoin} disabled={isLoggedIn}>Join</button>
          <button onClick={handleLeave} disabled={!isLoggedIn}>Leave</button>
          <button onClick={exportLog} disabled={!messages.length}>Export Log</button>
        </div>

        <p className="status">
          Status: {isLoggedIn ? '✅ Connected' : '❌ Disconnected'}
        </p>
      </section>

      <section className="panel">
        <h2>Messages</h2>
        <div className="messages">
          {!messages.length && <div className="empty">No messages yet…</div>}
          {messages.map((m, i) => (
            <div key={i} className="message">{m}</div>
          ))}
        </div>
      </section>

      <section className="panel notes">
        <h2>What to Observe</h2>
        <ul>
          <li><strong>Effects</strong> re-run only when <code>serverUrl</code> or <code>roomId</code> change.</li>
          <li><strong>Effect Events</strong> let you run non-reactive code (<code>logAnalytics</code>, <code>exportLog</code>) without adding them as dependencies.</li>
          <li><strong>Event Handlers</strong> (<code>Join</code>/<code>Leave</code>) are user-driven and don’t re-run automatically.</li>
          <li><strong>Fresh state</strong> is read inside Effect Events even when the effect depends on something else.</li>
        </ul>
      </section>

      <footer className="footer">
        <p>
          Try: change the Room ID or Server URL and watch the console for connect/disconnect logs.
          Toggle Join/Leave and see how the title and greeting behave.
        </p>
      </footer>
    </div>
  )
}
