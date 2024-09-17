import { createContext, useContext, ReactNode } from "react";

export const NotificationContext = createContext<Notification[]>([]);
export const NotifyContext = createContext<NotifyFunction>(() => {});

export enum Level {
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
  DANGER = "danger",
}

interface SendArgs {
  level: Level;
  contents: ReactNode;
  duration?: number;
}

interface Notification {
  id: number;
  level: Level;
  contents: ReactNode;
}

interface AddAction {
  action: "add";
  id: number;
  level: Level;
  contents: ReactNode;
}

interface RemoveAction {
  action: "remove";
  id: number;
}

type NotifyAction = AddAction | RemoveAction;

export interface NotifyFunction {
  (a: NotifyAction): void;
}

function RenderedNotification({
  level,
  children,
}: {
  level: Level;
  children: ReactNode;
}) {
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

let current_id = 0;

export function Send(
  notify: NotifyFunction,
  { level, contents, duration = 1000 }: SendArgs
) {
  const id = current_id++;
  notify({ action: "add", id: id, level: level, contents: contents });

  setTimeout(() => {
    notify({ action: "remove", id: id });
  }, duration);
}
export function notificationReducer(
  notifications: Notification[],
  n: NotifyAction
): Notification[] {
  switch (n.action) {
    case "add":
      return [...notifications, n];
    case "remove":
      return notifications.filter((x) => x.id !== n.id);
    default:
      return notifications;
  }
}
