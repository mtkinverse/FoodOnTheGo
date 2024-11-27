import React, { useEffect } from 'react';

const PopupAlert = ({ message, type, handleClose }) => {
  const bgColor = type === 'success' ? 'bg-green-200' : 'bg-red-200';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const borderColor = type === 'success' ? 'border-green-400' : 'border-red-400';
  const iconColor = type === 'success' ? 'text-green-400' : 'text-red-400';

  const iconPath = type === 'success'
    ? 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    : 'M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
  
    useEffect(() => {
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);
  
      return () => clearTimeout(timer);
    }, [handleClose]);
  
  return (
    <div className={`fixed bottom-4 left-4 ${bgColor} ${textColor} p-4 rounded-lg shadow-lg flex items-start space-x-3 z-50 animate-fade-in-up border-l-4 ${borderColor} max-w-md`}>
      <div className="flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-6 h-6 ${iconColor}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
        </svg>
      </div>
      <div className="flex-grow">
        <p className="font-medium">{message}</p>
      </div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 ml-auto -mr-1 -mt-1 text-gray-400 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
        aria-label="Close"
      >
        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default PopupAlert;

