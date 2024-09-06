import { useEffect, useState } from "react";

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
      <ul className="rule-list block">
        {rules.map((r) => (
          <li key={r.id}>{r.text}</li>
        ))}
      </ul>
    </section>
  );
}
