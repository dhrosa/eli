import { useEffect, useState, useReducer, useContext, useRef } from "react";
import * as Api from "./Api";
import Modal from "./Modal";

import { Control, Field, Label, ErrorList, SubmitButton, Input } from "./Form";
import { Send, NotifyContext } from "./Notification";

function AudienceRow({ audience, dispatch, notify }) {
  const [editActive, setEditActive] = useState(false);
  const onEditSuccess = (newAudience) => {
    setEditActive(false);
    dispatch({ type: "update", value: newAudience });
  };
  const onDelete = async () => {
    const id = audience.id;
    const response = await Api.Audience.delete(id);
    if (response.errors) {
      return;
    }
    dispatch({ type: "remove", id: id });
    Send(notify, {
      level: "success",
      contents: (
        <p>
          Deleted audience: <strong>{audience.name}</strong>
        </p>
      ),
    });
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
    const formData = new FormData(event.target);
    const newAudience = {
      ...audience,
      ...Object.fromEntries(formData.entries()),
    };
    const response = audience.id
      ? await Api.Audience.update(newAudience)
      : await Api.Audience.create(newAudience);
    if (response.value) {
      setErrors(null);
      onSuccess(response.value);
    } else {
      setErrors(response.error);
    }
  };

  return (
    <form className="form block" onSubmit={onSubmit}>
      <Field>
        <Label>Name</Label>
        <Control>
          <Input name="name" defaultValue={audience?.name} />
        </Control>
        <ErrorList errors={errors?.name} />
      </Field>

      <Field>
        <Label>Prompt</Label>
        <Control>
          <textarea
            className="textarea"
            name="prompt"
            defaultValue={audience?.prompt}
          />
        </Control>
        <ErrorList errors={errors?.prompt} />
      </Field>

      <Control>
        <SubmitButton>{audience ? "Update" : "Create"}</SubmitButton>
      </Control>
      <ErrorList errors={errors?.non_field_errors} />
    </form>
  );
}

function reducer(audiences, action) {
  switch (action.type) {
    case "set":
      return action.value;
    case "add":
      return [...audiences, action.value];
    case "remove":
      return audiences.filter((a) => a.id != action.id);
    case "update":
      return audiences.map((a) =>
        a.id === action.value.id ? action.value : a
      );
    default:
  }
  return audiences;
}

export default function () {
  const [audiences, dispatch] = useReducer(reducer, []);
  const [createModalActive, setCreateModalActive] = useState(false);
  const notify = useContext(NotifyContext);
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
    Send(notify, {
      level: "success",
      contents: (
        <p>
          Created audience: <strong>{audience.name}</strong>
        </p>
      ),
    });
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
              <AudienceRow
                audience={a}
                key={a.id}
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
