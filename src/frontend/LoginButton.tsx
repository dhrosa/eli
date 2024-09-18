import { useState, useContext, FormEventHandler, FormEvent } from "react";
import { UserDispatchContext, UserContext, User } from "./UserContext";
import Modal from "./Modal";

import { Control, Field, Label, ErrorList, SubmitButton } from "./Form";
import { Send, NotifyContext, Level } from "./Notification";

async function parseResponse(response: Response) {
  const value = await response.json();
  if (response.ok) {
    return {
      success: value,
    };
  }
  return {
    errors: value,
  };
}

function Form({
  user,
  onSuccess,
}: {
  user: User | null;
  onSuccess: (user: User) => void;
}) {
  if (user) {
    return false;
  }
  const [errors, setErrors] = useState<any>({});

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch("/token/", {
      method: "POST",
      body: new FormData(event.target as HTMLFormElement),
    });
    const data = await parseResponse(response);
    setErrors(data.errors);
    if (data.success) {
      onSuccess(data.success);
    }
  };

  return (
    <form className="form block" onSubmit={onSubmit as FormEventHandler}>
      <Field>
        <Label>Username</Label>
        <Control>
          <input
            className="input"
            type="text"
            name="username"
            placeholder="Username"
            autoComplete="username"
          />
        </Control>
        <ErrorList errors={errors?.username} />
      </Field>
      <Field>
        <Label>Password</Label>
        <Control>
          <input
            className="input"
            name="password"
            type="password"
            autoComplete="current-password"
          />
        </Control>
        <ErrorList errors={errors?.password} />
      </Field>
      <Control>
        <SubmitButton>Log In</SubmitButton>
      </Control>
      <ErrorList errors={errors?.non_field_errors} />
    </form>
  );
}

function ExistingUserDialog({
  user,
  onSuccess,
}: {
  user: User | null;
  onSuccess: any;
}) {
  if (!user) {
    return false;
  }
  return (
    <form onSubmit={onSuccess}>
      <p className="block">
        Logged in as <strong>{user.username}</strong>
      </p>
      <SubmitButton>Log Out</SubmitButton>
    </form>
  );
}

export default function LoginButton({ className }: { className?: string }) {
  const [modalIsActive, setModalIsActive] = useState(false);
  const notify = useContext(NotifyContext);
  const user = useContext(UserContext);
  const userDispatch = useContext(UserDispatchContext);

  const onLoginSuccess = ({
    username,
    token,
  }: {
    username: string;
    token: string;
  }) => {
    userDispatch({
      type: "login",
      value: { username: username, token: token },
    });
    Send(notify, {
      level: Level.SUCCESS,
      contents: (
        <p>
          Logged in successfully as <strong>username</strong>
        </p>
      ),
    });
    setModalIsActive(false);
  };

  const onLogoutSuccess = () => {
    userDispatch({ type: "logout" });
    Send(notify, {
      level: Level.SUCCESS,
      contents: <p>Logged out successfully</p>,
    });
    setModalIsActive(false);
  };

  return (
    <>
      <a
        className={"material-icons " + (className ?? "")}
        href="#"
        title="Log In"
        onClick={() => {
          setModalIsActive(true);
        }}
      >
        person
      </a>
      <Modal
        active={modalIsActive}
        onClose={() => {
          setModalIsActive(false);
        }}
      >
        <ExistingUserDialog user={user} onSuccess={onLogoutSuccess} />
        <Form user={user} onSuccess={onLoginSuccess} />
      </Modal>
    </>
  );
}
