# React 19 – Separating Events from Effects (Vite)

A minimal, ready-to-run project demonstrating:
- Event handlers (user-driven logic)
- Effects (reactive synchronization)
- Effect Events (`useEvent`) for non-reactive code inside effects

## Quick Start

```bash
npm i
npm run dev
# open the shown local URL
```

## Try This
- Change the Room ID or Server URL and watch the console for connect/disconnect.
- Click Join/Leave and see how the document title and greeting behave.
- Export Log to download a text file of the in-memory messages.


> Note: This project includes a local `useEvent` hook polyfill in `src/hooks/useEvent.js` so it runs on any React 18/19 build where `useEvent` is not exported.
