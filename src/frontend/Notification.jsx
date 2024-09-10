import { createContext, useContext } from "react";

export const NotificationContext = createContext(null);
export const NotifyContext = createContext(null);

function RenderedNotification({ notification }) {
  const className = `notification is-${notification.level}`;
  return <div className={className}>{notification.contents}</div>;
}

export function RenderedNotificationList() {
  const state = useContext(NotificationContext);
  const children = Array.from(
    (state ? state.items : []).map((n) => (
      <RenderedNotification key={n.id} notification={n} />
    )),
  );
  return <div className="notification-list">{children}</div>;
}

export function Success(contents) {
  return { action: "add", level: "success", contents: contents };
}

export function notificationReducer(state, event) {
  if (!state) {
    state = { items: [], next_id: 0 };
  }
  switch (event.action) {
    case "add":
      return {
        items: [...state.items, { ...event, next_id: state.next_id }],
        next_id: state.next_id + 1,
      };
    case "remove":
      return {
        items: state.items.filter((n) => n.id !== event.id),
        next_id: state.next_id,
      };
    default:
      return state;
  }
}
