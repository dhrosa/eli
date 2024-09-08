import { useEffect, useState, useReducer } from "react";
import Api from "./Api";

function AudienceRow({ audience }) {
  return (
    <tr>
      <th>{audience.name}</th>
      <td>{audience.prompt}</td>
    </tr>
  );
}

function ErrorList({ items }) {
  if (!items) {
    return false;
  }
  return (
    <ul className="has-text-danger">
      {items.map((e) => (
        <li className="help">{e}</li>
      ))}
    </ul>
  );
}

function Form({ audience, onSuccess }) {
  const [errors, setErrors] = useState(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const request = {
      method: "POST",
      body: new FormData(event.currentTarget),
    };
    const response = await Api("/api/audiences/", request);
    const json = await response.json();
    console.log(json);
    if (response.ok) {
      setErrors(null);
      onSuccess(json);
    } else {
      setErrors(json);
    }
  };
  return (
    <form className="form block" onSubmit={onSubmit}>
      <div className="field">
        <label className="label">Name</label>
        <div className="control">
          <input type="text" className="input" name="name" />
        </div>
        <ErrorList items={errors?.name} />
      </div>

      <div className="field">
        <label className="label">Prompt</label>
        <div className="control">
          <textarea className="textarea" name="prompt" />
        </div>
        <ErrorList items={errors?.prompt} />
      </div>

      <div className="control">
        <button className="button is-primary" type="submit">
          Submit
        </button>
      </div>
      <ErrorList items={errors?.non_field_errors} />
    </form>
  );
}

function reducer(audiences, action) {
  switch (action.type) {
    case "set":
      return action.value;
    case "add":
      return [...audiences, action.value];
  }
}

export default function () {
  const [audiences, dispatch] = useReducer(reducer, []);
  useEffect(() => {
    const get = async () => {
      const response = await fetch("/api/audiences/");
      dispatch({ type: "set", value: await response.json() });
    };

    get().catch(console.error);
  }, []);
  const onCreateSuccess = (audience) => {
    dispatch({ type: "add", value: audience });
  };
  return (
    <>
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
      <section className="section">
        <Form onSuccess={onCreateSuccess} />
      </section>
    </>
  );
}
