import { useEffect, useState, useContext } from "react";
import { NotifyContext, Send } from "./Notification";

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
  const notify = useContext(NotifyContext);
  useEffect(() => {
    const get = async () => {
      const response = await fetch("/api/rules/");
      const rules = await response.json();
      setRules(rules);
    };

    get().catch(console.error);
  }, []);
  useEffect(() => {
    Send(notify, { level: "success", contents: "meow" });
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
            <RuleRow rule={r} key={r.id} />
          ))}
        </tbody>
      </table>
    </section>
  );
}
