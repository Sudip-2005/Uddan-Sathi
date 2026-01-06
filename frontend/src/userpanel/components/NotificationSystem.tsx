import React, { useEffect, useState } from 'react';

export default function NotificationSystem({ pnr }: { pnr: string }) {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const checkAlerts = async () => {
      try {
        // Calling your Flask backend
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/notifications/${pnr}`);
        const result = await response.json();
        if (result.ok) {
          setNotifications(result.data);
        }
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };

    checkAlerts();
    const interval = setInterval(checkAlerts, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [pnr]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-[9999]">
      {notifications.map((note) => (
        <div key={note.id} className="bg-red-600 text-white p-4 shadow-lg flex justify-between items-center animate-pulse">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span className="font-bold">{note.message}</span>
          </div>
          <button 
            onClick={() => setNotifications([])} 
            className="bg-white text-red-600 px-2 py-1 rounded text-xs font-bold"
          >
            DISMISS
          </button>
        </div>
      ))}
    </div>
  );
}