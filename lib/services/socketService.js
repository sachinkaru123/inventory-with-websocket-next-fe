import { io } from 'socket.io-client';
import { store } from '../store/store';
import { updateItem, setConnectionStatus } from '../store/inventorySlice';
import { addNotification } from '../store/notificationSlice';

class SocketService {
  constructor() {
    this.socket = null;
    this.processedAlerts = new Set(); // Prevent duplicate alerts
    this.processedUpdates = new Set(); // Prevent duplicate updates
  }

  // Connect to WebSocket server
  connect() {
    if (this.socket?.connected) return;

    console.log('🔌 Connecting to WebSocket server...');

    // Try to connect to local IP first, fallback to localhost
    const serverUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 
                     window.location.hostname !== 'localhost' ? 
                     `http://${window.location.hostname}:3001` : 
                     'http://localhost:3001';

    console.log('🌐 Connecting to:', serverUrl);

    // Create socket connection
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      forceNew: true,
    });

    this.setupEventListeners();
  }

  // Set up all event listeners
  setupEventListeners() {
    if (!this.socket) return;

    // ========== CONNECTION EVENTS ==========
    this.socket.on('connect', () => {
      console.log('✅ Connected to WebSocket server');
      store.dispatch(setConnectionStatus(true));
      this.joinRooms();
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from WebSocket server');
      store.dispatch(setConnectionStatus(false));
    });

    this.socket.on('reconnect', () => {
      console.log('🔄 Reconnected to WebSocket server');
      store.dispatch(setConnectionStatus(true));
      this.processedAlerts.clear(); // Clear duplicates on reconnect
      this.processedUpdates.clear(); // Clear update duplicates on reconnect
      this.joinRooms();
    });

    // ========== INVENTORY EVENTS ==========
    
    // 1. Handle inventory updates (silent updates)
    this.socket.on('inventory-update', (data) => {
      console.log('📦 Inventory update:', data);
      this.updateInventoryItem(data);
    });

    // 2. Handle inventory alerts (show notifications)
    this.socket.on('inventory-alert', (alertData) => {
      console.log('🚨 Alert received:', alertData);
      this.handleAlert(alertData);
    });

    // 3. Handle initial data sync
    this.socket.on('inventory_sync', (items) => {
      console.log('🔄 Syncing inventory:', items?.length, 'items');
      this.syncInventory(items);
    });

    // ========== LEGACY EVENTS (for backward compatibility) ==========
    this.socket.on('item_updated', (data) => {
      console.log('📝 Legacy item update:', data);
      this.updateInventoryItem(data);
    });
  }

  // Update a single inventory item
  updateInventoryItem(data) {
    // Handle different data structures
    const item = data?.data || data;
    
    if (item && (item.id !== undefined || item.name !== undefined)) {
      // Create unique ID to prevent duplicate processing
      const updateId = `${item.id}-${item.name}-${item.stock}-${Date.now()}`;
      
      // Skip if we've processed this exact update recently (within 1 second)
      const recentUpdates = Array.from(this.processedUpdates).filter(id => {
        const timestamp = parseInt(id.split('-').pop());
        return Date.now() - timestamp < 1000; // 1 second window
      });
      
      const isDuplicate = recentUpdates.some(id => 
        id.startsWith(`${item.id}-${item.name}-${item.stock}`)
      );
      
      if (isDuplicate) {
        console.log('⏭️ Skipping duplicate update for:', item.name);
        return;
      }
      
      // Add to processed updates
      this.processedUpdates.add(updateId);
      
      // Clean up old updates (keep only last 10)
      if (this.processedUpdates.size > 10) {
        const oldestUpdate = Array.from(this.processedUpdates)[0];
        this.processedUpdates.delete(oldestUpdate);
      }
      
      store.dispatch(updateItem(item));
    }
  }

  // Handle alert notifications
  handleAlert(alertData) {
    // Create unique ID to prevent duplicates
    const alertId = `${alertData.type}-${alertData.item_id}-${alertData.timestamp}`;
    
    // Skip if already processed
    if (this.processedAlerts.has(alertId)) {
      console.log('⏭️ Skipping duplicate alert');
      return;
    }
    
    // Mark as processed
    this.processedAlerts.add(alertId);
    
    // Determine notification type
    const type = alertData.severity === 'critical' ? 'error' : 
                 alertData.severity === 'warning' ? 'warning' : 'info';
    
    // Create message
    let message = alertData.message || 'Inventory alert';
    if (alertData.current_count && alertData.threshold) {
      message += ` (${alertData.current_count}/${alertData.threshold})`;
    }
    
    // Show notification
    store.dispatch(addNotification({
      message: message,
      type: type,
      duration: alertData.severity === 'critical' ? 10000 : 7000,
      severity: alertData.severity,
      current_count: alertData.current_count,
      threshold: alertData.threshold
    }));
  }

  // Sync multiple inventory items
  syncInventory(items) {
    if (items && Array.isArray(items)) {
      items.forEach(item => {
        store.dispatch(updateItem(item));
      });
      
      // Only show notification for initial connection (when we have no items)
      const currentItems = store.getState().inventory.items;
      if (items.length > 0 && currentItems.length === 0) {
        store.dispatch(addNotification({
          message: `✅ Connected - Loaded ${items.length} items`,
          type: 'success',
          duration: 3000
        }));
      }
    }
  }

  // Join server rooms for targeted notifications
  joinRooms() {
    if (this.socket?.connected) {
      this.socket.emit('join-inventory-updates');
      this.socket.emit('join-inventory-alerts');
      console.log('🏠 Joined inventory rooms');
    }
  }

  // Disconnect from server
  disconnect() {
    if (this.socket) {
      console.log('👋 Disconnecting from WebSocket server...');
      this.socket.disconnect();
      this.socket = null;
      store.dispatch(setConnectionStatus(false));
      this.processedAlerts.clear();
      this.processedUpdates.clear();
    }
  }

  // Check connection status
  isConnected() {
    return this.socket?.connected || false;
  }

  // Send event to server
  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('⚠️ Socket not connected. Cannot emit:', event);
    }
  }
}

// Export single instance
const socketService = new SocketService();
export default socketService;
