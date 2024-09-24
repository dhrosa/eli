import { useState, FormEventHandler, FormEvent } from "react";
import { User, useUser } from "./User";
import Modal from "./Modal";

import { Control, Field, Label, ErrorList, SubmitButton } from "./Form";
import { toast } from "react-toastify";
import Symbol from "./Symbol";

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

function Form({ onSuccess }: { onSuccess: (user: User) => void }) {
  const [user] = useUser();
  const [errors, setErrors] = useState<any>({});

  if (user) {
    return false;
  }

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

function ExistingUserDialog({ onSuccess }: { onSuccess: any }) {
  const [user] = useUser();
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
  const [, userDispatch] = useUser();

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
    toast(
      <p>
        Logged in successfully as <strong>username</strong>
      </p>,
      {
        type: "success",
      }
    );
    setModalIsActive(false);
  };

  const onLogoutSuccess = () => {
    userDispatch({ type: "logout" });
    toast(<p>Logged out successfully</p>, {
      type: "success",
    });
    setModalIsActive(false);
  };

  return (
    <>
      <a
        className={className}
        href="#"
        title="Log In"
        onClick={() => {
          setModalIsActive(true);
        }}
      >
        <Symbol name="person" />
      </a>
      <Modal
        active={modalIsActive}
        onClose={() => {
          setModalIsActive(false);
        }}
      >
        <ExistingUserDialog onSuccess={onLogoutSuccess} />
        <Form onSuccess={onLoginSuccess} />
      </Modal>
    </>
  );
}
