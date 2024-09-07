import { useState } from "react";

import Cookie from "js-cookie";

function UserName() {
  return Cookie.get("username") ?? "Anonymous";
}

function Form() {
  return (
    <form className="form">
      <div className="field">
        <label className="label">Username</label>
        <div className="control">
          <input className="input" type="text" placeholder="User Name" />
        </div>
      </div>
      <div className="field">
        <label className="label">Password</label>
        <div className="control">
          <input className="input" type="password" />
        </div>
      </div>
    </form>
  );
}

function LoginPanel() {
  return (
    <div className="panel">
      <div className="panel-heading">Log In</div>
      <div className="panel-block">
        <Form />
      </div>
    </div>
  );
}

function Modal({ isActive = false, onClose }) {
  const activeClass = isActive ? "is-active" : "";
  return (
    <div className={"modal " + activeClass}>
      <div className="modal-background" onClick={onClose} />
      <div className="modal-content">
        <LoginPanel />
      </div>
      <button
        className="modal-close is-large"
        onClick={onClose}
        aria-label="close"
      />
    </div>
  );
}

export default function ({ className }) {
  const [modalIsActive, setModalIsActive] = useState(false);
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
      <Modal isActive={modalIsActive} onClose={() => setModalIsActive(false)} />
    </>
  );
}
