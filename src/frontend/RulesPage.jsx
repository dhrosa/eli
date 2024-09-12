import { Control, Label } from "./Form";
import { useEffect, useState, useContext, useReducer } from "react";
import { Send, NotifyContext } from "./Notification";
import Modal from "./Modal";

function Form() {
  return false;
}

function RuleRow({ rule, dispatch, notify }) {
  const [editActive, setEditActive] = useState(false);
  const onEditSuccess = (newRule) => {
    setEditActive(false);
    dispatch({ type: "update", value: newRule });
  };
  const onDelete = async () => {
    const id = rule.id;
    const response = await Api.Rule.delete(id);
    if (response.errors) {
      return;
    }
    dispatch({ type: "remove", id: id });
    Send(notify, {
      level: "success",
      contents: (
        <p>
          Deleted rule: <strong>{rule.name}</strong>
        </p>
      ),
    });
  };

  return (
    <tr>
      <th>{rule.name}</th>
      <td>{rule.text}</td>
      <td>
        <button
          className="button material-icons icon"
          onClick={() => setEditActive(true)}
        >
          edit
        </button>
        <button className="button material-icons icon" onClick={onDelete}>
          delete
        </button>
        <Modal active={editActive} onClose={() => setEditActive(false)}>
          <Form rule={rule} onSuccess={onEditSuccess} />
        </Modal>
      </td>
    </tr>
  );
}

export default function () {
  const [rules, dispatch] = useReducer(reducer, []);
  const [createModalActive, setCreateModalActive] = useState(false);
  const notify = useContext(NotifyContext);

  useEffect(() => {
    const get = async () => {
      const response = await fetch("/api/rules/");
      dispatch({ type: "set", value: await response.json() });
    };

    get().catch(console.error);
  }, []);

  const onCreateSuccess = (rule) => {
    setCreateModalActive(false);
    dispatch({ type: "add", value: rule });
    Send(notify, {
      level: "success",
      contents: (
        <p>
          Created rule: <strong>{rule.name}</strong>
        </p>
      ),
    });
  };

  return (
    <>
      <section className="section">
        <p className="block">
          ELI will follow the rules below for all queries:
        </p>
        <table className="table">
          <thead>
            <tr>
              <th>Rule Name</th>
              <th>Prompt</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r) => (
              <RuleRow
                rule={r}
                key={r.name}
                dispatch={dispatch}
                notify={notify}
              />
            ))}
          </tbody>
        </table>
        <button
          className="button is-primary"
          onClick={() => setCreateModalActive(true)}
        >
          Create New Rule
        </button>
      </section>
      <Modal
        active={createModalActive}
        onClose={() => setCreateModalActive(false)}
      >
        <Form onSuccess={onCreateSuccess} />
      </Modal>
    </>
  );
}

function reducer(rules, action) {
  switch (action.type) {
    case "set":
      return action.value;
    case "add":
      return [...rules, action.value];
    case "remove":
      return rules.filter((a) => a.id != action.id);
    case "update":
      return rules.map((a) => (a.id === action.value.id ? action.value : a));
    default:
  }
  return rules;
}
