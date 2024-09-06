import { Link } from "react-router-dom";
import { useEffect, useState, useId } from "react";
import Api from "./Api";
import Conversation from "./Conversation";

function SelectOption({ choice }) {
  return <option value={choice.value}>{choice.display_name}</option>;
}

function Select({ id, name, choices }) {
  const options = choices.map((c) => <SelectOption key={c.value} choice={c} />);
  return (
    <div className="select">
      <select id={id} name={name}>
        {options}
      </select>
    </div>
  );
}

function Field({ className, children }) {
  className = "field " + (className || "");
  return <div className={className}>{children}</div>;
}

function Control({ className, children }) {
  className = "control " + (className || "");
  return <div className={className}>{children}</div>;
}

function Label({ children }) {
  return <label className="label">{children}</label>;
}

function Help({ children }) {
  return <p className="help">{children}</p>;
}

function SelectField({ label, name, id, choices, help }) {
  return (
    <Field>
      <Label>{label}</Label>
      <Control>
        <Select name={name} id={id} choices={choices} />
      </Control>
      <Help>{help}</Help>
    </Field>
  );
}

function Form({ aiModelChoices, audienceChoices, onResponse }) {
  const onSubmit = async (event) => {
    // Prevent normal form submission request and reload.
    event.preventDefault();

    const headers = new Headers();
    const formData = new FormData(event.currentTarget);
    formData.audience = "dog";
    const request = {
      method: "POST",
      body: formData,
      headers: headers,
    };
      const response = await Api("/api/query/", request);
      onResponse(await response.json());
  };

  const id = useId();
  return (
    <form onSubmit={onSubmit}>
      <SelectField
        name="audience"
        id={"audience-" + id}
        choices={audienceChoices}
        label="Explain Like I'm A:"
        help="The target audience for ELI's responses."
      />

      <SelectField
        name="ai_model_name"
        id={"ai-" + id}
        choices={aiModelChoices}
        label="AI Model:"
        help="LLM backend"
      />

      <Field className="is-grouped is-grouped-right">
        <Control className="is-expanded">
          <input
            name="query"
            autoComplete="off"
            className="input"
            placeholder="Query. e.g. 'What is a cat?'"
          />
        </Control>
        <Control>
          <button className="button is-primary material-icons">send</button>
        </Control>
      </Field>
    </form>
  );
}

export default function() {
  const [aiModelChoices, setAiModelChoices] = useState([]);
  const [audienceChoices, setAudienceChoices] = useState([]);
  useEffect(() => {
    const get = async () => {
      const request = {
        method: "OPTIONS",
      };
      const response = await Api("/api/query/", request);
      const options = await response.json();
      const fields = options.actions.POST;
      setAiModelChoices(fields.ai_model_name.choices);
      setAudienceChoices(fields.audience.choices);
    };
    get().catch(console.error);
  }, []);
    
    const onResponse = (response) => {
        console.log("response: ", response);
    };
    
  return (
      <Form aiModelChoices={aiModelChoices} audienceChoices={audienceChoices} onResponse={onResponse}/>
  );
}
