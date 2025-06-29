import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  isConnected: false,
  lastUpdated: null,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    updateItem: (state, action) => {
      console.log('Redux updateItem called with:', action.payload);
      
      // Handle different data structures
      let itemData = action.payload;
      if (itemData.data) {
        // Laravel event structure
        itemData = itemData.data;
      }
      
      const { id, name, stock } = itemData;
      console.log('Destructured values:', { id, name, stock });
      
      // Validate required fields
      if (id === undefined || name === undefined || stock === undefined) {
        console.error('Invalid item data - missing required fields:', itemData);
        return;
      }
      
      const existingItemIndex = state.items.findIndex(item => item.id === id);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const oldStock = state.items[existingItemIndex].stock;
        state.items[existingItemIndex] = { id, name, stock };
        console.log('Updated existing item at index:', existingItemIndex);
        
        // Mark as updated for notification purposes
        state.lastAction = {
          type: 'updated',
          item: { id, name, stock, oldStock },
          timestamp: new Date().toISOString(),
        };
      } else {
        // Add new item
        state.items.push({ id, name, stock });
        console.log('Added new item, total items now:', state.items.length);
        
        // Mark as new for notification purposes
        state.lastAction = {
          type: 'created',
          item: { id, name, stock },
          timestamp: new Date().toISOString(),
        };
      }
      
      state.lastUpdated = new Date().toISOString();
    },
    setItems: (state, action) => {
      state.items = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },
    clearItems: (state) => {
      state.items = [];
    },
    clearLastAction: (state) => {
      state.lastAction = null;
    },
  },
});

export const { updateItem, setItems, setConnectionStatus, clearItems, clearLastAction } = inventorySlice.actions;
export default inventorySlice.reducer;
