import { useState, useContext } from "react";
import Api from "./Api";
import { UserDispatchContext, UserContext } from "./UserContext";

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

function ErrorList({ items }) {
  if (!items) {
    return false;
  }
  return (
    <ul className="has-text-danger">
      {items.map((e) => (
        <li className="help">{e}</li>
      ))}
    </ul>
  );
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
        <ErrorList items={errors?.username} />
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
        <ErrorList items={errors?.password} />
      </div>
      <div className="control">
        <button className="button is-primary" type="submit">
          Log In
        </button>
      </div>
      <ErrorList items={errors?.non_field_errors} />
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

function Modal({ children, isActive = false, onClose }) {
  const user = useContext(UserContext);
  var contents = user ? <ExistingUserDialog user={user} /> : children;
  const activeClass = isActive ? "is-active" : "";
  return (
    <div className={"modal " + activeClass}>
      <div className="modal-background" onClick={onClose} />
      <div className="modal-content box">{contents}</div>
      <button
        className="modal-close is-large"
        onClick={onClose}
        aria-label="close"
      />
    </div>
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
      <Modal isActive={modalIsActive} onClose={() => setModalIsActive(false)}>
        <Form onSuccess={onSuccess} />
        <SuccessMessage username={successfulUsername} />
      </Modal>
    </>
  );
}
