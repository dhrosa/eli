import { useState, useContext } from "react";
import { UserDispatchContext, UserContext } from "./UserContext";
import Modal from "./Modal";

import { Control, Field, Label, ErrorList, SubmitButton, Input } from "./Form";
import { Send, NotifyContext } from "./Notification";

async function parseResponse(response) {
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

function Form({ user, onSuccess }) {
  if (user) {
    return false;
  }
  const [errors, setErrors] = useState([]);

  const onSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch("/token/", {
      method: "POST",
      body: new FormData(event.target),
    });
    const data = await parseResponse(response);
    setErrors(data.errors);
    if (data.success) {
      onSuccess(data.success);
    }
  };

  return (
    <form className="form block" onSubmit={onSubmit}>
      <Field>
        <Label>Username</Label>
        <Control>
          <Input
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
          <Input
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

function ExistingUserDialog({ user, onSuccess }) {
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

export default function LoginButton({ className }) {
  const [modalIsActive, setModalIsActive] = useState(false);
  const notify = useContext(NotifyContext);
  const user = useContext(UserContext);
  const userDispatch = useContext(UserDispatchContext);

  const onLoginSuccess = ({ username, token }) => {
    userDispatch({
      type: "login",
      value: { username: username, token: token },
    });
    Send(notify, {
      level: "success",
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
      level: "success",
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
        onClick={() => setModalIsActive(true)}
      >
        person
      </a>
      <Modal active={modalIsActive} onClose={() => setModalIsActive(false)}>
        <ExistingUserDialog user={user} onSuccess={onLogoutSuccess} />
        <Form user={user} onSuccess={onLoginSuccess} />
      </Modal>
    </>
  );
}
