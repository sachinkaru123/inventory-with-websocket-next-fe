import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  nextId: 1,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const notification = {
        id: state.nextId++,
        message: action.payload.message,
        type: action.payload.type || 'info', // 'success', 'error', 'warning', 'info'
        duration: action.payload.duration || 5000,
        timestamp: new Date().toISOString(),
        // Additional fields for inventory alerts
        alertData: action.payload.alertData || null,
        current_count: action.payload.current_count || null,
        threshold: action.payload.threshold || null,
        severity: action.payload.severity || null,
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { addNotification, removeNotification, clearAllNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
