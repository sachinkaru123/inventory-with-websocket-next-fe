'use client';

import { useEffect } from 'react';
import socketService from '../services/socketService';
import { useInventoryNotifications } from '../hooks/useInventoryNotifications';

export function SocketProvider({ children }) {
  // Enable inventory notifications
  useInventoryNotifications();
  
  useEffect(() => {
    // Connect to socket when component mounts
    socketService.connect();

    // Cleanup function to disconnect when component unmounts
    return () => {
      socketService.disconnect();
    };
  }, []);

  return <>{children}</>;
}
