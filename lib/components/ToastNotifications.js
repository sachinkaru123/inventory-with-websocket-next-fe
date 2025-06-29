'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeNotification } from '../store/notificationSlice';

export function ToastNotifications() {
  const notifications = useSelector((state) => state.notifications.notifications);
  const dispatch = useDispatch();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  const getNotificationColors = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <ToastItem
          key={notification.id}
          notification={notification}
          onRemove={() => dispatch(removeNotification(notification.id))}
          getIcon={getNotificationIcon}
          getColors={getNotificationColors}
        />
      ))}
    </div>
  );
}

function ToastItem({ notification, onRemove, getIcon, getColors }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, notification.duration);

    return () => clearTimeout(timer);
  }, [notification.duration, onRemove]);

  const isAlert = notification.alertData || notification.severity;

  return (
    <div
      className={`
        ${getColors(notification.type)}
        px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out
        animate-slide-in-right flex items-start space-x-3 min-w-80
        ${isAlert ? 'border-l-4 border-white' : ''}
      `}
    >
      <div className="flex-shrink-0 text-lg font-bold mt-0.5">
        {getIcon(notification.type)}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{notification.message}</p>
        {isAlert && (
          <div className="mt-2 text-xs opacity-90">
            {notification.severity && (
              <div className="flex items-center space-x-2">
                <span className="font-semibold">Severity:</span>
                <span className="uppercase">{notification.severity}</span>
              </div>
            )}
            {notification.current_count && notification.threshold && (
              <div className="flex items-center space-x-2 mt-1">
                <span className="font-semibold">Count:</span>
                <span>{notification.current_count} / {notification.threshold}</span>
              </div>
            )}
            <div className="text-xs opacity-75 mt-1">
              {new Date(notification.timestamp).toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>
      <button
        onClick={onRemove}
        className="flex-shrink-0 text-white hover:text-gray-200 transition-colors mt-0.5"
      >
        <span className="text-lg">×</span>
      </button>
    </div>
  );
}
