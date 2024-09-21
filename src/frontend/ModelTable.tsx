import {
  useEffect,
  useReducer,
  useState,
  useContext,
  FormEvent,
  createContext,
} from "react";
import { Send, NotifyContext, Level, NotifyFunction } from "./Notification";
import Modal from "./Modal";
import { Model } from "./Api";
import { useUser, User } from "./UserContext";

import { Field, Label, Control, ErrorList, SubmitButton } from "./Form";

interface Shared {
  model: Model;
  fields: FieldDescription[];
  dispatch: (action: Action) => void;
  notify: NotifyFunction;
  user: User | null;
}

const SharedContext = createContext<Shared>({} as Shared);

interface Item {
  id: string;

  name: string;
  [key: string]: any;
}

export default function ModelTable({
  model,
  fields,
}: {
  model: Model;
  fields: FieldDescription[];
}) {
  const [user] = useUser();
  const [items, dispatch] = useReducer(reducer, []);
  const [createModalActive, setCreateModalActive] = useState(false);
  const notify = useContext(NotifyContext);

  const shared: Shared = {
    model: model,
    fields: fields,
    dispatch: dispatch,
    notify: notify,
    user: user,
  };

  // Fetch initial list of items
  useEffect(() => {
    const get = async () => {
      const response = await model.list();
      dispatch({ type: "set", value: response.value });
    };
    get().catch((e: unknown) => {
      console.error(e);
    });
  }, []);

  //
  const onCreateSuccess = (newItem: Item) => {
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
    <SharedContext.Provider value={shared}>
      <section className="section">
        <table className="table">
          <thead>
            <tr>
              {fields.map((field) => (
                <th key={field.name}>{field.label}</th>
              ))}
              {user && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item: Item) => (
              <Row key={item.id} item={item} />
            ))}
          </tbody>
        </table>
        {user && (
          <button
            className="button is-primary"
            onClick={() => {
              setCreateModalActive(true);
            }}
          >
            Create New {model.type}
          </button>
        )}
        <Modal
          active={createModalActive}
          onClose={() => {
            setCreateModalActive(false);
          }}
        >
          <Form onSuccess={onCreateSuccess} />
        </Modal>
      </section>
    </SharedContext.Provider>
  );
}

function Row({ item }: { item: Item }) {
  const [editActive, setEditActive] = useState(false);
  const { model, fields, dispatch, notify, user } = useContext(SharedContext);
  const onEditSuccess = (newItem: Item) => {
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
    if (!user) {
      return;
    }
    const id = item.id;
    const response = await model.delete(id, user);
    if (response.error) {
      console.error(response.error);
      return;
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
      {user && (
        <td>
          <button
            className="button material-icons icon"
            onClick={() => {
              setEditActive(true);
            }}
          >
            edit
          </button>
          <button className="button material-icons icon" onClick={onDelete}>
            delete
          </button>
          <Modal
            active={editActive}
            onClose={() => {
              setEditActive(false);
            }}
          >
            <Form item={item} onSuccess={onEditSuccess} />
          </Modal>
        </td>
      )}
    </tr>
  );
}

interface FieldDescription {
  name: string;
  label: string;
  widget: string;
}

function Form({
  item,
  onSuccess,
}: {
  item?: Item;
  onSuccess: (newItem: Item) => void;
}) {
  const { user, model, fields } = useContext(SharedContext);
  const [errors, setErrors] = useState<any>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) {
      return;
    }
    const formData = new FormData(event.target as HTMLFormElement);
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

interface SetAction {
  type: "set";
  value: Item[];
}

interface AddAction {
  type: "add";
  value: Item;
}

interface RemoveAction {
  type: "remove";
  id: string;
}

interface UpdateAction {
  type: "update";
  value: Item;
}

type Action = SetAction | AddAction | RemoveAction | UpdateAction;

function reducer(items: Item[], action: Action) {
  switch (action.type) {
    case "set":
      return action.value;
    case "add":
      return [...items, action.value];
    case "remove":
      return items.filter((a) => a.id != action.id.toString());
    case "update":
      return items.map((x) => (x.id === action.value.id ? action.value : x));
    default:
  }
  return items;
}
