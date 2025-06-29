# Inventory WebSocket Frontend

A minimal Next.js 14 (App Router) frontend application demonstrating real-time inventory management using Socket.IO, Redux Toolkit, and Tailwind CSS.

## Features

- ⚡ **Real-time Updates**: Inventory changes are instantly reflected via WebSocket
- 🔄 **Auto Reconnection**: Handles disconnects and reconnects automatically
- 📊 **Redux State Management**: Centralized state with Redux Toolkit
- 🎨 **Modern UI**: Beautiful Tailwind CSS styling
- 📱 **Responsive Design**: Works on all device sizes
- 🏗️ **Next.js 14 App Router**: Latest Next.js features

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19
- **State Management**: Redux Toolkit, React-Redux
- **Real-time Communication**: Socket.IO Client
- **Styling**: Tailwind CSS 4
- **Language**: JavaScript (JSX)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the demo Socket.IO server** (in one terminal)
   ```bash
   npm run demo-server
   ```
   This starts a demo server on `http://localhost:3001` that sends random inventory updates.

3. **Start the Next.js app** (in another terminal)
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Project Structure

```
├── app/                          # Next.js 14 App Router
│   ├── inventory/                # Inventory page route
│   │   └── page.js              # Inventory listing component
│   ├── layout.js                # Root layout with providers
│   ├── page.js                  # Home page
│   └── globals.css              # Global styles
├── lib/                         # Business logic
│   ├── providers/               # React context providers
│   │   ├── ReduxProvider.js     # Redux store provider
│   │   └── SocketProvider.js    # Socket.IO connection manager
│   ├── services/                # External services
│   │   └── socketService.js     # Socket.IO client service
│   └── store/                   # Redux store
│       ├── inventorySlice.js    # Inventory state slice
│       └── store.js             # Store configuration
├── demo-server.js               # Demo Socket.IO server
└── package.json
```

## WebSocket Events

The application listens for these Socket.IO events:

### Incoming Events (from server)
- `item_updated`: Single item update
  ```javascript
  { id: 1, name: "Widget A", stock: 25 }
  ```
- `inventory_sync`: Bulk inventory sync (optional)
  ```javascript
  [
    { id: 1, name: "Widget A", stock: 25 },
    { id: 2, name: "Widget B", stock: 3 }
  ]
  ```

### Connection Events
- `connect`: WebSocket connected
- `disconnect`: WebSocket disconnected  
- `connect_error`: Connection error
- `reconnect`: Successfully reconnected
- `reconnect_error`: Reconnection failed

## Redux Store Structure

```javascript
{
  inventory: {
    items: [
      { id: 1, name: "Widget A", stock: 25 },
      { id: 2, name: "Widget B", stock: 3 }
    ],
    isConnected: true,
    lastUpdated: "2025-06-29T12:00:00.000Z"
  }
}
```

## Available Routes

- `/` - Home page with connection status and quick stats
- `/inventory` - Full inventory listing with real-time updates

## Socket.IO Server Integration

To connect to your own Socket.IO server, update the server URL in:
`lib/services/socketService.js`:

```javascript
this.socket = io('http://your-server:port', {
  // ... options
});
```

### Expected Server Events

Your Socket.IO server should emit:

1. **`item_updated`** when an inventory item changes:
   ```javascript
   io.emit('item_updated', {
     id: 1,
     name: 'Widget A', 
     stock: 25
   });
   ```

2. **`inventory_sync`** (optional) for bulk updates:
   ```javascript
   io.emit('inventory_sync', [
     { id: 1, name: 'Widget A', stock: 25 },
     { id: 2, name: 'Widget B', stock: 3 }
   ]);
   ```

## Development

```bash
# Start development server
npm run dev

# Build for production  
npm run build

# Start production server
npm start

# Run demo Socket.IO server
npm run demo-server

# Lint code
npm run lint
```

## Demo Server Details

The included `demo-server.js` provides:
- Sample inventory data (5 items)
- Random stock updates every 2 seconds
- CORS enabled for localhost:3000
- Connection logging

Perfect for testing and development!

---

**Need help?** Check the browser console for WebSocket connection logs and any error messages.
# inventory-with-websocket-next-fe
