// A tiny mock "server connection" that fires a message periodically.
// In a real app, you'd open a websocket or SSE channel here.
export function connectToServer(serverUrl, roomId, onMessage) {
  console.log(`🔗 Connected to ${serverUrl} (room: ${roomId})`)

  let count = 0
  const interval = setInterval(() => {
    count += 1
    onMessage?.(`[#${count}] Message from ${roomId} @ ${new Date().toLocaleTimeString()}`)
  }, 1500)

  return () => {
    clearInterval(interval)
    console.log(`❌ Disconnected from ${serverUrl} (room: ${roomId})`)
  }
}
