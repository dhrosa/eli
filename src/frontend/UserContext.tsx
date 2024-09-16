import { createContext } from "react";

export interface User {
  username: string;
  token: string;
}

interface UserAction {
  type: "login" | "logout";
  value?: User;
}

interface UserDispatch {
  (action: UserAction): void;
}

export const UserContext = createContext<User | null>(null);
export const UserDispatchContext = createContext<UserDispatch>(() => {});
