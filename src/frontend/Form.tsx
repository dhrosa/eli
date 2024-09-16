import { ReactNode } from "react";

export function Field({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={"field " + (className ?? "")}>{children}</div>;
}

export function Control({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={"control " + (className ?? "")}>{children}</div>;
}

export function Label({ children }: { children: ReactNode }) {
  return <label className="label">{children}</label>;
}

export function ErrorList({ errors }: { errors: string[] }) {
  if (!errors) {
    return null;
  }
  return (
    <ul>
      {errors.map((error, i) => (
        <li key={i}>
          <small className="has-text-danger">{error}</small>
        </li>
      ))}
    </ul>
  );
}

export function SubmitButton({
  children = "Submit",
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <button type="submit" className={"button is-primary " + (className ?? "")}>
      {children}
    </button>
  );
}

export function Input({ type = "text", ...props }) {
  return <input type={type} className="input" {...props} />;
}

export function Help({ children }) {
  return <p className="help">{children}</p>;
}
