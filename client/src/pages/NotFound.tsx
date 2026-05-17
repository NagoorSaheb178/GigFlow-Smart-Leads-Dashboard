import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-rose-100 dark:bg-rose-900/30 rounded-2xl text-rose-600">
            <AlertCircle size={64} />
          </div>
        </div>
        <h1 className="text-6xl font-black text-gray-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-6">Page Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-lg"
        >
          <Home size={20} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
