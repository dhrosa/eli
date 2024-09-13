import { useEffect, useState, useId } from "react";
import Conversation from "./Conversation";

import { Control, Field, Label, Help } from "./Form";

function SelectOption({ choice }) {
  return <option value={choice.value}>{choice.display_name}</option>;
}

function Select({ id, name, choices }) {
  return (
    <div className="select">
      <select id={id} name={name}>
        {choices.map((c) => (
          <SelectOption key={c.value} choice={c} />
        ))}
      </select>
    </div>
  );
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

function Form({ aiModelChoices, audienceChoices, onPending, onResponse }) {
  const onSubmit = async (event) => {
    onPending();
    event.preventDefault();

    const response = await fetch("/api/query/", {
      method: "POST",
      body: new FormData(event.target),
    });
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

function SubmittedConversation({ conversation, pending }) {
  if (!pending && !conversation) {
    return false;
  }
  return <Conversation object={conversation} />;
}

export default function () {
  const [aiModelChoices, setAiModelChoices] = useState([]);
  const [audienceChoices, setAudienceChoices] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const get = async () => {
      const response = await fetch("/api/query/", { method: "OPTIONS" });
      const options = await response.json();
      const fields = options.actions.POST;
      setAiModelChoices(fields.ai_model_name.choices);
      setAudienceChoices(fields.audience.choices);
    };
    get().catch(console.error);
  }, []);

  const onPending = () => {
    setPending(true);
    setConversation(null);
  };

  const onResponse = (response) => {
    setPending(false);
    setConversation(response);
  };

  return (
    <>
      <section className="section">
        <Form
          aiModelChoices={aiModelChoices}
          audienceChoices={audienceChoices}
          onPending={onPending}
          onResponse={onResponse}
        />
      </section>
      <section className="section">
        <SubmittedConversation conversation={conversation} pending={pending} />
      </section>
    </>
  );
}
