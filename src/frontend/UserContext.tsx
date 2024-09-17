import { createContext } from "react";
import Cookies from "js-cookie";


export interface User {
  username: string;
  token: string;
}

interface LoginAction {
  type: "login";
  value: User;
}

interface LogoutAction {
  type: "logout";
}

type UserAction = LoginAction | LogoutAction;

interface UserDispatch {
  (action: UserAction): void;
}

export const UserContext = createContext<User | null>(null);
export const UserDispatchContext = createContext<UserDispatch>(() => { });

export function userReducer(_user: User | null, action: UserAction): User | null {
  switch (action.type) {
    case "login": {
      Cookies.set("eli-user", JSON.stringify(action.value));
      return action.value;
    }
    case "logout": {
      Cookies.remove("eli-user");
      return null;
    }
  }
}

export function initialUser(): User | null {
  const encoded = Cookies.get("eli-user");
  return encoded ? JSON.parse(encoded) : null;
}
