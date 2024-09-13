import { useEffect, useReducer, useState, useContext } from "react";
import { Send, NotifyContext } from "./Notification";
import Modal from "./Modal";

import { Field, Label, Control, ErrorList, SubmitButton, Input } from "./Form";

export default function ({ model, fields }) {
  const [items, dispatch] = useReducer(reducer, []);
  const [createModalActive, setCreateModalActive] = useState(false);
  const notify = useContext(NotifyContext);

  useEffect(() => {
    const get = async () => {
      const response = await model.list();
      dispatch({ type: "set", value: response.value });
    };
    get().catch(console.error);
  }, []);

  return (
    <section className="section">
      <table className="table">
        <thead>
          <tr>
            {fields.map((field) => (
              <th key={field.name}>{field.label}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <Row
              key={item.id}
              model={model}
              item={item}
              fields={fields}
              dispatch={dispatch}
              notify={notify}
            />
          ))}
        </tbody>
      </table>
    </section>
  );
}

function Row({ model, fields, item, dispatch, notify }) {
  const [editActive, setEditActive] = useState(false);
  const onEditSuccess = (newItem) => {
    setEditActive(false);
    dispatch({ type: "update", value: newItem });
  };

  const onDelete = async () => {
    const id = item.id;
    const response = await model.delete(id);
    if (response.error) {
      console.error(response.error);
    }
    dispatch({ type: "remove", id: id });
    Send(notify, {
      level: "success",
      contents: (
        <p>
          Deleted {model.type}: <strong>{item.name}</strong>
        </p>
      ),
    });
  };

  return (
    <tr>
      {fields.map((field) => (
        <td key={field.name}>{item[field.name]}</td>
      ))}
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
          <Form
            model={model}
            fields={fields}
            item={item}
            onSuccess={onEditSuccess}
            notify={notify}
          />
        </Modal>
      </td>
    </tr>
  );
}

function Form({ model, item, onSuccess, fields, notify }) {
  const [errors, setErrors] = useState(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newItem = { ...item, ...Object.fromEntries(formData.entries()) };
    const response = item.id
      ? await model.update(newItem)
      : await model.create(newItem);
    if (response.value) {
      setErrors(null);
      onSuccess(response.value);
    } else {
      setErrors(response.error);
    }
  };

  return (
    <form className="form block" onSubmit={onSubmit}>
      {fields.map((field) => (
        <ModelField
          key={field.name}
          field={field}
          errors={errors}
          item={item}
        />
      ))}
      <Control>
        <SubmitButton>{item.id ? "Update" : "Create"}</SubmitButton>
      </Control>
    </form>
  );
}

function ModelField({ field, errors, item }) {
  return (
    <Field>
      <Label>{field.label}</Label>
      <Control>
        {field.widget == "text" && (
          <Input
            type={field.widget}
            name={field.name}
            defaultValue={item?.[field.name]}
          />
        )}
        {field.widget == "textarea" && (
          <textarea
            className="textarea"
            name={field.name}
            defaultValue={item?.[field.name]}
          />
        )}
      </Control>
    </Field>
  );
}

function reducer(items, action) {
  switch (action.type) {
    case "set":
      return action.value;
    case "add":
      return [...items, action.value];
    case "remove":
      return items.filter((a) => a.id != action.id);
    case "update":
      return items.map((x) => (x.id === action.value.id ? action.value : x));
    default:
  }
  return items;
}
