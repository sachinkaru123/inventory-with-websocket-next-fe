'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addNotification } from '../store/notificationSlice';
import { clearLastAction } from '../store/inventorySlice';

export function useInventoryNotifications() {
  const lastAction = useSelector((state) => state.inventory.lastAction);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!lastAction) return;

    const { type, item } = lastAction;

    if (type === 'created') {
      dispatch(addNotification({
        message: `New item created: "${item.name}" with ${item.stock} in stock`,
        type: 'success',
        duration: 5000,
      }));
    } else if (type === 'updated') {
      const stockChange = item.stock - item.oldStock;
      let message = `Item "${item.name}" updated`;
      
      if (stockChange > 0) {
        message += ` (+${stockChange} stock)`;
      } else if (stockChange < 0) {
        message += ` (${stockChange} stock)`;
      }
      
      // Determine notification type based on stock level
      let notificationType = 'info';
      if (item.stock === 0) {
        notificationType = 'error';
        message += ' - Out of stock!';
      } else if (item.stock <= 5) {
        notificationType = 'warning';
        message += ' - Low stock warning';
      } else if (stockChange > 0) {
        notificationType = 'success';
      }

      dispatch(addNotification({
        message,
        type: notificationType,
        duration: 4000,
      }));
    }

    // Clear the last action after processing
    dispatch(clearLastAction());
  }, [lastAction, dispatch]);
}
