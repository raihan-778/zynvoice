import { Button } from "@/components/ui/button";
import { Notification } from "@/hooks/useNotification";
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";

interface AnimatedNotificationsProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export function AnimatedNotifications({
  notifications,
  onDismiss,
}: AnimatedNotificationsProps) {
  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return CheckCircle;
      case "error":
        return AlertCircle;
      case "warning":
        return AlertTriangle;
      case "info":
        return Info;
      default:
        return Info;
    }
  };

  const getNotificationStyles = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300";
      case "error":
        return "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-300";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900/20 dark:border-gray-700 dark:text-gray-300";
    }
  };

  const getIconColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "text-green-600 dark:text-green-400";
      case "error":
        return "text-red-600 dark:text-red-400";
      case "warning":
        return "text-yellow-600 dark:text-yellow-400";
      case "info":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {notifications.map((notification) => {
        const Icon = getNotificationIcon(notification.type);
        return (
          <div
            key={notification.id}
            className={`
              border rounded-lg p-4 shadow-lg backdrop-blur-sm
              transform transition-all duration-300 ease-in-out
              animate-in slide-in-from-right-full
              ${getNotificationStyles(notification.type)}
            `}
          >
            <div className="flex items-start gap-3">
              <Icon
                className={`h-5 w-5 mt-0.5 flex-shrink-0 ${getIconColor(
                  notification.type
                )}`}
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold">{notification.title}</h4>
                <p className="text-sm mt-1 opacity-90">
                  {notification.message}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDismiss(notification.id)}
                className="h-6 w-6 p-0 hover:bg-black/10 dark:hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
