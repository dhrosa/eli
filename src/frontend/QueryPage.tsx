import { useEffect, useState, FormEvent } from "react";
import Conversation from "./Conversation";
import Carousel from "./RecentConversations";
import Symbol from "./Symbol";
import QuerySuggestions from "./QuerySuggestions";

import { Control, Field, Label, Help } from "./Form";

interface Choice {
  value: string;
  display_name: string;
}

function SelectOption({ choice }: { choice: Choice }) {
  return <option value={choice.value}>{choice.display_name}</option>;
}

function Select({ name, choices }: { name: string; choices: Choice[] }) {
  return (
    <div className="select">
      <select name={name}>
        {choices.map((c) => (
          <SelectOption key={c.value} choice={c} />
        ))}
      </select>
    </div>
  );
}

function SelectField({
  label,
  name,
  choices,
  help,
}: {
  label: string;
  name: string;
  choices: Choice[];
  help: string;
}) {
  return (
    <Field>
      <Label>{label}</Label>
      <Control>
        <Select name={name} choices={choices} />
      </Control>
      <Help>{help}</Help>
    </Field>
  );
}

function Form({
  onPending,
  onResponse,
}: {
  onPending: () => void;
  onResponse: (response: any) => any;
}) {
  const [aiModelChoices, setAiModelChoices] = useState([]);
  const [audienceChoices, setAudienceChoices] = useState([]);

  useEffect(() => {
    const get = async () => {
      const response = await fetch("/api/query/", { method: "OPTIONS" });
      const options = await response.json();
      const fields = options.actions.POST;
      setAiModelChoices(fields.ai_model_name.choices);
      setAudienceChoices(fields.audience.choices);
    };
    get().catch((e: unknown) => {
      console.error(e);
    });
  }, []);

  const onSubmit = async (event: FormEvent) => {
    onPending();
    event.preventDefault();

    const response = await fetch("/api/query/", {
      method: "POST",
      body: new FormData(event.target as HTMLFormElement),
    });
    onResponse(await response.json());
  };

  return (
    <form className="form block" onSubmit={onSubmit}>
      <SelectField
        name="audience"
        choices={audienceChoices}
        label="Explain Like I'm A:"
        help="The target audience for ELI's responses."
      />

      <SelectField
        name="ai_model_name"
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
          <button className="button is-primary">
            <Symbol name="send" />
          </button>
        </Control>
      </Field>
    </form>
  );
}

function SubmittedConversation({
  conversation,
  pending,
}: {
  conversation: any;
  pending: boolean;
}) {
  if (!pending && !conversation) {
    return false;
  }
  return <Conversation object={conversation} />;
}

export default function QueryPage() {
  const [conversation, setConversation] = useState(null);
  const [pending, setPending] = useState(false);

  const onPending = () => {
    setPending(true);
    setConversation(null);
  };

  const onResponse = (response: any) => {
    setPending(false);
    setConversation(response);
  };

  return (
    <>
      <section className="section">
        <Form onPending={onPending} onResponse={onResponse} />
        <QuerySuggestions />
      </section>

      <section className="section">
        <SubmittedConversation conversation={conversation} pending={pending} />
      </section>

      <section className="section">
        <h2 className="title">Recent Conversations</h2>
        <Carousel />
      </section>
    </>
  );
}
