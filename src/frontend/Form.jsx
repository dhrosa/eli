export function Field({ children, className }) {
  return <div className={"field " + className}>{children}</div>;
}

export function Control({ children, className }) {
  return <div className={"control " + className}>{children}</div>;
}

export function Label({ children }) {
  return <label className="label">{children}</label>;
}

export function ErrorList({ errors }) {
  if (!errors) {
    return null;
  }
  return (
    <div className="notification is-danger">
      <ul>
        {errors.map((error) => (
          <li>{error}</li>
        ))}
      </ul>
    </div>
  );
}

export function SubmitButton({ children = "Submit", className }) {
  return (
    <button type="submit" className={className}>
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
