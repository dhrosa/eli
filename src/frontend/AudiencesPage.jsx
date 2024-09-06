import { useEffect, useState } from "react";

function AudienceRow({ audience }) {
  return (
    <tr>
      <th>{audience.name}</th>
      <td>{audience.prompt}</td>
    </tr>
  );
}

export default function () {
  const [audiences, setAudiences] = useState([]);
  useEffect(() => {
    const get = async () => {
      const response = await fetch("/api/audiences/");
      setAudiences(await response.json());
    };

    get().catch(console.error);
  }, []);
  return (
    <section className="section">
      <p className="block">
        ELI can explain things to the following audiences:
      </p>
      <table className="table">
        <thead>
          <tr>
            <th>Audience Name</th>
            <th>Prompt</th>
          </tr>
        </thead>
        <tbody>
          {audiences.map((a) => (
            <AudienceRow audience={a} key={a.name} />
          ))}
        </tbody>
      </table>
    </section>
  );
}
