import { useState, useCallback } from "react";

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number; // in milliseconds, default 5000
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (notification: Omit<Notification, "id">) => {
      const id =
        Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const newNotification: Notification = {
        ...notification,
        id,
        duration: notification.duration || 5000,
      };

      setNotifications((prev) => [...prev, newNotification]);

      // Auto-dismiss after duration
      setTimeout(() => {
        dismissNotification(id);
      }, newNotification.duration);
    },
    []
  );

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    dismissNotification,
    clearAllNotifications,
  };
}
