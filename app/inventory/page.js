'use client';

import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { addNotification } from '../../lib/store/notificationSlice';

export default function InventoryPage() {
  const { items, isConnected, lastUpdated } = useSelector((state) => state.inventory);
  const dispatch = useDispatch();

  console.log('InventoryPage rendered with items:', items);
  console.log('Individual items:');
  items.forEach((item, index) => {
    console.log(`Item ${index}:`, item);
    console.log(`  id: ${item.id} (type: ${typeof item.id})`);
    console.log(`  name: ${item.name} (type: ${typeof item.name})`);
    console.log(`  stock: ${item.stock} (type: ${typeof item.stock})`);
  });

  const testNotification = (type) => {
    const messages = {
      success: 'Test success notification - Item created successfully!',
      error: 'Test error notification - Item is out of stock!',
      warning: 'Test warning notification - Low stock alert!',
      info: 'Test info notification - Item updated.',
    };
    
    dispatch(addNotification({
      message: messages[type],
      type,
      duration: 5000,
    }));
  };
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString();
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return 'out-of-stock';
    if (stock <= 5) return 'low-stock';
    return 'in-stock';
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'out-of-stock':
        return 'text-red-600 bg-red-50';
      case 'low-stock':
        return 'text-yellow-600 bg-yellow-50';
      case 'in-stock':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
              <p className="mt-2 text-gray-600">Real-time inventory tracking with WebSocket</p>
            </div>
            <div className="flex space-x-3">
              <Link 
                href="/items/create"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                + Create Item
              </Link>
              <Link 
                href="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    WebSocket Status: {isConnected ? 'Connected' : 'Disconnected'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Last updated: {formatTimestamp(lastUpdated)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Debug Info</h4>
            <div className="text-sm text-yellow-700">
              <p>Items count: {items.length}</p>
              <p>Raw items data:</p>
              <pre className="mt-2 text-xs bg-yellow-100 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(items, null, 2)}
              </pre>
            </div>
            
            {/* Test Notification Buttons */}
            <div className="mt-4 pt-4 border-t border-yellow-200">
              <h5 className="font-medium text-yellow-800 mb-2">Test Notifications</h5>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => testNotification('success')}
                  className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                >
                  Success
                </button>
                <button
                  onClick={() => testNotification('error')}
                  className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                >
                  Error
                </button>
                <button
                  onClick={() => testNotification('warning')}
                  className="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                >
                  Warning
                </button>
                <button
                  onClick={() => testNotification('info')}
                  className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                >
                  Info
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Stats */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">📦</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Items</dt>
                    <dd className="text-lg font-medium text-gray-900">{items.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">In Stock</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {items.filter(item => item.stock > 5).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">⚠</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Low Stock</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {items.filter(item => item.stock > 0 && item.stock <= 5).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✕</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Out of Stock</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {items.filter(item => item.stock === 0).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Inventory Items</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              All items are updated in real-time via WebSocket connection.
            </p>
          </div>
          <div className="border-t border-gray-200">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  <p className="text-lg font-medium">No items in inventory</p>
                  <p className="mt-2">Waiting for WebSocket data...</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item) => {
                      const stockStatus = getStockStatus(item.stock);
                      const statusColor = getStockStatusColor(stockStatus);
                      
                      return (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="font-medium">{item.stock}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                              {stockStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
