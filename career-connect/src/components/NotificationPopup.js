import React, { useEffect } from 'react';

const NotificationPopup = ({ error, message, onClose }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    if (!message) return null;

    const backgroundColor = error === 'true' ? 'bg-red-500' : 'bg-green-500';

    return (
        <div className={`fixed bottom-4 right-4 ${backgroundColor} text-white p-4 rounded shadow-lg`}>
            <p>{message}</p>
        </div>
    );
};

export default NotificationPopup;
