export default function ({ errors }) {
  if (!errors) {
    return false;
  }
  return (
    <ul className="has-text-danger">
      {errors.map((e) => (
        <li className="help">{e}</li>
      ))}
    </ul>
  );
}
