import { useState } from "react";

export default function ({ children, active, onClose }) {
  return (
    <div className={"modal " + (active ? "is-active" : "")}>
      <div className="modal-background" onClick={onClose} />
      <div className="modal-content box">{children}</div>
      <button
        className="modal-close is-large"
        onClick={onClose}
        aria-label="close"
      />
    </div>
  );
}
