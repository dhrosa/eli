import { useState, useEffect } from "react";

export default function ({ children, active, onClose }) {
  useEffect(() => {
    const onEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    addEventListener("keydown", onEscape);
    return () => {
      removeEventListener("keydown", onEscape);
    };
  });
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
