import { useEffect, useState, useReducer } from "react";
import Api from "./Api";
import ErrorList from "./ErrorList";
import Modal from "./Modal";

function AudienceRow({ audience, dispatch }) {
  const [editActive, setEditActive] = useState(false);
  const onEditSuccess = (newAudience) => {
    setEditActive(false);
    dispatch({ type: "update", value: newAudience });
  };
  const onDelete = async () => {
    const id = audience.id;
    const response = await Api(`/api/audiences/${id}/`, { method: "DELETE" });
    if (response.ok) {
      dispatch({ type: "remove", id: id });
    }
  };
  return (
    <tr>
      <th>{audience.name}</th>
      <td>{audience.prompt}</td>
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
          <Form audience={audience} onSuccess={onEditSuccess} />
        </Modal>
      </td>
    </tr>
  );
}

function Form({ audience, onSuccess }) {
  const [errors, setErrors] = useState(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    var request = {
      method: "POST",
      body: new FormData(event.currentTarget),
    };
    var url = "/api/audiences/";
    if (audience) {
      url += audience.id + "/";
      request.method = "PUT";
    }
    const response = await Api(url, request);
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
          <input
            type="text"
            className="input"
            name="name"
            defaultValue={audience?.name}
          />
        </div>
        <ErrorList errors={errors?.name} />
      </div>

      <div className="field">
        <label className="label">Prompt</label>
        <div className="control">
          <textarea
            className="textarea"
            name="prompt"
            defaultValue={audience?.prompt}
          />
        </div>
        <ErrorList errors={errors?.prompt} />
      </div>

      <div className="control">
        <button className="button is-primary" type="submit">
          Submit
        </button>
      </div>
      <ErrorList errors={errors?.non_field_errors} />
    </form>
  );
}

function reducer(audiences, action) {
  console.log(audiences, action);
  switch (action.type) {
    case "set":
      return action.value;
    case "add":
      return [...audiences, action.value];
    case "remove":
      return audiences.filter((a) => a.id != action.id);
    case "update":
      return audiences.map((a) =>
        a.id === action.value.id ? action.value : a,
      );
    default:
  }
  return audiences;
}

export default function () {
  const [audiences, dispatch] = useReducer(reducer, []);
  const [createModalActive, setCreateModalActive] = useState(false);
  useEffect(() => {
    const get = async () => {
      const response = await fetch("/api/audiences/");
      dispatch({ type: "set", value: await response.json() });
    };

    get().catch(console.error);
  }, []);
  const onCreateSuccess = (audience) => {
    setCreateModalActive(false);
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {audiences.map((a) => (
              <AudienceRow audience={a} key={a.id} dispatch={dispatch} />
            ))}
          </tbody>
        </table>
        <button
          className="button is-primary"
          onClick={() => setCreateModalActive(true)}
        >
          Create New Audience
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
