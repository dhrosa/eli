import { useEffect, ReactNode } from "react";

export default function Modal({
  children,
  active,
  onClose,
}: {
  children: ReactNode;
  active: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    const onEscape = (event: any) => {
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
