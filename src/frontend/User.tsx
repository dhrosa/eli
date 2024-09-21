import Cookies from "js-cookie";
import { createReducerContext } from "react-use";

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

function reducer(_user: User | null, action: UserAction): User | null {
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

export const [useUser, UserProvider] = createReducerContext(
  reducer,
  initialUser()
);

export function initialUser(): User | null {
  const encoded = Cookies.get("eli-user");
  return encoded ? JSON.parse(encoded) : null;
}
