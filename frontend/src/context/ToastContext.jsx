import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import Toast from '../components/common/Toast';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((title, message, type = 'info', redirect = null) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, title, message, type, redirect }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const value = useMemo(() => ({ showToast, removeToast }), [showToast, removeToast]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-4 pointer-events-none w-full max-w-sm">
                {toasts.map((toast) => (
                    <Toast 
                        key={toast.id} 
                        {...toast} 
                        onClose={() => removeToast(toast.id)} 
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};
