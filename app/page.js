'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';

export default function Home() {
  const { items, isConnected } = useSelector((state) => state.inventory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Inventory WebSocket App
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time inventory management system powered by Next.js 14, Redux Toolkit, and Socket.IO
          </p>
        </div>

        {/* Connection Status Card */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-center mb-4">
              <div className={`w-4 h-4 rounded-full mr-3 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-lg font-medium text-gray-900">
                WebSocket {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <p className="text-sm text-gray-500 text-center">
              {isConnected 
                ? 'Connected to Socket.IO server at localhost:3001' 
                : 'Trying to connect to Socket.IO server...'}
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-2xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Updates</h3>
            <p className="text-gray-600">
              Inventory changes are instantly reflected across all connected clients via WebSocket.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-2xl">🔄</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Auto Reconnection</h3>
            <p className="text-gray-600">
              Automatic reconnection handling with connection status indicators and error recovery.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Redux State</h3>
            <p className="text-gray-600">
              Centralized state management with Redux Toolkit for predictable data flow.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Current Inventory Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{items.length}</div>
              <div className="text-sm text-gray-500">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {items.filter(item => item.stock > 5).length}
              </div>
              <div className="text-sm text-gray-500">In Stock</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {items.filter(item => item.stock > 0 && item.stock <= 5).length}
              </div>
              <div className="text-sm text-gray-500">Low Stock</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {items.filter(item => item.stock === 0).length}
              </div>
              <div className="text-sm text-gray-500">Out of Stock</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="space-x-4">
            <Link 
              href="/inventory"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              View Inventory
              <span className="ml-2">→</span>
            </Link>
            <Link 
              href="/items/create"
              className="inline-flex items-center px-8 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              + Create Item
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500">
          <p className="text-sm">
            Built with Next.js 14 (App Router), Redux Toolkit, Socket.IO, and Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}
