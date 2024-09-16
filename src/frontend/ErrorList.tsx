export default function ErrorList({ errors }: { errors: string[] }) {
  if (!errors) {
    return false;
  }
  return (
    <ul className="has-text-danger">
      {errors.map((e, i) => (
        <li key={i} className="help">
          {e}
        </li>
      ))}
    </ul>
  );
}
