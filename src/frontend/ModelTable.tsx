import { useEffect, useReducer, useState, useContext } from "react";
import { Send, NotifyContext, Level, NotifyFunction } from "./Notification";
import Modal from "./Modal";
import { Model } from "./Api";
import { UserContext } from "./UserContext";

import { Field, Label, Control, ErrorList, SubmitButton } from "./Form";

export default function ModelTable({
  model,
  fields,
}: {
  model: Model;
  fields: FieldDescription[];
}) {
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

  const onCreateSuccess = (newItem: any) => {
    setCreateModalActive(false);
    dispatch({ type: "add", value: newItem });
    Send(notify, {
      level: Level.SUCCESS,
      contents: (
        <p>
          Created {model.type}: <strong>{newItem.name}</strong>
        </p>
      ),
    });
  };

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
          {items.map((item: any) => (
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
      <button
        className="button is-primary"
        onClick={() => setCreateModalActive(true)}
      >
        Create New {model.type}
      </button>
      <Modal
        active={createModalActive}
        onClose={() => setCreateModalActive(false)}
      >
        <Form model={model} fields={fields} onSuccess={onCreateSuccess} />
      </Modal>
    </section>
  );
}

function Row({
  model,
  fields,
  item,
  dispatch,
  notify,
}: {
  model: Model;
  fields: FieldDescription[];
  item: any;
  dispatch: any;
  notify: NotifyFunction;
}) {
  const user = useContext(UserContext);
  const [editActive, setEditActive] = useState(false);
  const onEditSuccess = (newItem: any) => {
    setEditActive(false);
    dispatch({ type: "update", value: newItem });
    Send(notify, {
      level: Level.SUCCESS,
      contents: (
        <p>
          Updated {model.type}: <strong>{newItem.name}</strong>
        </p>
      ),
    });
  };

  const onDelete = async () => {
    const id = item.id;
    const response = await model.delete(id, user || undefined);
    if (response.error) {
      console.error(response.error);
    }
    dispatch({ type: "remove", id: id });
    Send(notify, {
      level: Level.SUCCESS,
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
          />
        </Modal>
      </td>
    </tr>
  );
}

type FieldDescription = { name: string; label: string; widget: string };

function Form({
  model,
  item,
  onSuccess,
  fields,
}: {
  model: any;
  item?: any;
  onSuccess: (newItem: any) => void;
  fields: FieldDescription[];
}) {
  const user = useContext(UserContext);
  const [errors, setErrors] = useState<any>(null);

  const onSubmit = async (event: any) => {
    event.preventDefault();
    if (!user) {
      setErrors({
        non_field_errors: ["You must be logged in to perform this action."],
      });
    }
    const formData = new FormData(event.target);
    const newItem = { ...item, ...Object.fromEntries(formData.entries()) };
    const response = item?.id
      ? await model.update(newItem, user)
      : await model.create(newItem, user);
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
        <SubmitButton>{item?.id ? "Update" : "Create"}</SubmitButton>
      </Control>
      <ErrorList errors={errors?.non_field_errors} />
    </form>
  );
}

function ModelField({
  field,
  errors,
  item,
}: {
  field: FieldDescription;
  errors: any;
  item: any;
}) {
  return (
    <Field>
      <Label>{field.label}</Label>
      <Control>
        {field.widget == "text" && (
          <input
            className="input"
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
        <ErrorList errors={errors?.[field.name]} />
      </Control>
    </Field>
  );
}

function reducer(
  items: any[],
  action: { id?: number; type: string; value?: any }
) {
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
