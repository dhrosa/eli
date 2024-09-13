import { createContext, useContext } from "react";

export const NotificationContext = createContext(null);
export const NotifyContext = createContext(null);

function RenderedNotification({ level, children }) {
  return <div className={"notification is-" + level}>{children}</div>;
}

export function RenderedNotificationList() {
  const notifications = useContext(NotificationContext);
  return (
    <div className="notification-list">
      {notifications.map((n) => (
        <RenderedNotification key={n.id} level={n.level}>
          {n.contents}
        </RenderedNotification>
      ))}
    </div>
  );
}

var current_id = 0;

export function Send(notify, { level, contents, duration = 1000 }) {
  const id = current_id++;
  notify({ action: "add", id: id, level: level, contents: contents });
  setTimeout(() => {
    notify({ action: "remove", id: id });
  }, duration);
}
export function notificationReducer(notifications, n) {
  switch (n.action) {
    case "add":
      return [...notifications, n];
    case "remove":
      return notifications.filter((x) => x.id !== n.id);
    default:
      return notifications;
  }
}
