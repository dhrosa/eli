import { useEffect, useState } from "react";

function RuleRow({ rule }) {
  return (
    <tr>
      <th>{rule.name}</th>
      <td>{rule.text}</td>
    </tr>
  );
}

export default function () {
  const [rules, setRules] = useState([]);
  useEffect(() => {
    const get = async () => {
      const response = await fetch("/api/rules/");
      const rules = await response.json();
      setRules(rules);
    };

    get().catch(console.error);
  }, []);
  return (
    <section className="section">
      <p className="block">ELI will follow the rules below for all queries:</p>
      <table className="table">
        <thead>
          <tr>
            <th>Rule Name</th>
            <th>Prompt</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((r) => (
            <RuleRow rule={r} key={r.name} />
          ))}
        </tbody>
      </table>
    </section>
  );
}
