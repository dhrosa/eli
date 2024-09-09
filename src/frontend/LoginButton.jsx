import { useState, useContext } from "react";
import Api from "./Api";
import { UserDispatchContext, UserContext } from "./UserContext";
import Modal from "./Modal";
import ErrorList from "./ErrorList";

import Cookie from "js-cookie";

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

function Form({ onSuccess }) {
  const [errors, setErrors] = useState(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    const headers = new Headers();
    const formData = new FormData(event.currentTarget);
    const request = {
      method: "POST",
      headers: headers,
      body: new FormData(event.currentTarget),
    };
    const response = await Api("/token/", request);
    const data = await parseResponse(response);
    setErrors(data.errors);
    if (data.success) {
      onSuccess(data.success);
    }
  };

  return (
    <form className="form block" onSubmit={onSubmit}>
      <div className="field">
        <label className="label">Username</label>
        <div className="control">
          <input
            className="input"
            type="text"
            name="username"
            placeholder="Username"
            autoComplete="username"
          />
        </div>
        <ErrorList errors={errors?.username} />
      </div>
      <div className="field">
        <label className="label">Password</label>
        <div className="control">
          <input
            className="input"
            name="password"
            type="password"
            autoComplete="current-password"
          />
        </div>
        <ErrorList errors={errors?.password} />
      </div>
      <div className="control">
        <button className="button is-primary" type="submit">
          Log In
        </button>
      </div>
      <ErrorList errors={errors?.non_field_errors} />
    </form>
  );
}

function ExistingUserDialog({ user }) {
  const userDispatch = useContext(UserDispatchContext);
  const onSubmit = (event) => {
    event.preventDefault();
    userDispatch({ type: "logout" });
  };
  return (
    <form onSubmit={onSubmit}>
      <p className="block">
        Logged in as <strong>{user.username}</strong>
      </p>
      <button type="submit" className="button is-primary">
        Log Out
      </button>
    </form>
  );
}

function SuccessMessage({ username }) {
  if (!username) {
    return false;
  }
  return (
    <div className="notification is-success">
      <p>
        Successfully logged in as <strong>{username}</strong>
      </p>
    </div>
  );
}

export default function ({ className }) {
  const [modalIsActive, setModalIsActive] = useState(false);
  const [successfulUsername, setSuccessfulUsername] = useState(null);
  const user = useContext(UserContext);
  const userDispatch = useContext(UserDispatchContext);
  const onSuccess = ({ username, token }) => {
    setSuccessfulUsername(username);
    userDispatch({
      type: "login",
      value: { username: username, token: token },
    });
    setTimeout(() => {
      setModalIsActive(false);
      setSuccessfulUsername(null);
    }, 2000);
  };

  var body = (
    <>
      <Form onSuccess={onSuccess} />
      <SuccessMessage username={successfulUsername} />
    </>
  );
  if (user) {
    body = <ExistingUserDialog user={user} />;
  }

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
        {body}
      </Modal>
    </>
  );
}
