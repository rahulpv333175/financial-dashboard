import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000); // Toast visible for 3 seconds
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.show && (
        <div
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-[9999] px-6 py-3 rounded-lg shadow-xl border-2 font-semibold text-white ${
            toast.type === 'error' ? 'bg-red-500 border-red-700' : 'bg-green-500 border-green-700'
          } transition-opacity duration-300`}
          style={{ opacity: toast.show ? 1 : 0 }}
        >
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
};