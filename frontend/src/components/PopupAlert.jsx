import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';

const PopupAlert = ({ message, type, handleClose }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    const interval = setInterval(() => {
      setProgress((prev) => Math.max(prev - 2, 0));
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [handleClose]);

  const styles = {
    success: {
      background: 'bg-gradient-to-r from-emerald-50 to-teal-50',
      border: 'border-l-emerald-500',
      icon: 'text-emerald-500',
      progress: 'bg-emerald-500/20',
      progressFill: 'bg-emerald-500',
      ring: 'focus:ring-emerald-500',
    },
    error: {
      background: 'bg-gradient-to-r from-rose-50 to-pink-50',
      border: 'border-l-rose-500',
      icon: 'text-rose-500',
      progress: 'bg-rose-500/20',
      progressFill: 'bg-rose-500',
      ring: 'focus:ring-rose-500',
    }
  };

  const currentStyle = type === 'success' ? styles.success : styles.error;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md animate-fade-in-up">
      <div
        className={`relative overflow-hidden ${currentStyle.background} backdrop-blur-sm border-l-4 ${currentStyle.border} 
        rounded-lg shadow-lg shadow-black/5 ring-1 ring-black/5`}
      >
        {/* Main content */}
        <div className="flex items-start space-x-3 p-4">
          <div className="flex-shrink-0">
            {type === 'success' ? (
              <FaCheckCircle className={`w-5 h-5 ${currentStyle.icon}`} />
            ) : (
              <FaTimesCircle className={`w-5 h-5 ${currentStyle.icon}`} />
            )}
          </div>
          <div className="flex-grow min-w-0">
            <p className="font-medium text-sm text-gray-900 leading-5 break-words">
              {message}
            </p>
          </div>
          <button
            onClick={handleClose}
            className={`flex-shrink-0 -mr-2 -mt-2 p-2 rounded-full text-gray-400 
            hover:text-gray-900 focus:outline-none focus:ring-2 ${currentStyle.ring} 
            transition-colors duration-200`}
            aria-label="Close"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Progress track */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 ${currentStyle.progress}`}>
          <div
            className={`h-full transition-all ease-linear ${currentStyle.progressFill}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default PopupAlert;

