import { useEffect, useState, FormEvent } from "react";
import Conversation from "./Conversation";
import Carousel from "./RecentConversations";
import Symbol from "./Symbol";
import QuerySuggestions from "./QuerySuggestions";
import { useAnimate, motion } from "framer-motion";

import { Control, Field, Label, Help, ErrorList } from "./Form";

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

function ButtonChoice({ name, choices }: { name: string; choices: Choice[] }) {
  const [value, setValue] = useState("");
  useEffect(() => {
    if (value != "" || choices.length == 0) {
      return;
    }
    setValue(choices[0].value);
  }, [choices]);
  return (
    <>
      <input type="hidden" name={name} value={value} />
      <div className="button-choices block">
        {choices.map((c) => (
          <button
            key={c.value}
            className={"button" + (c.value == value ? " is-primary" : "")}
            type="button"
            onClick={() => {
              setValue(c.value);
            }}
          >
            {c.display_name}
          </button>
        ))}
      </div>
    </>
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
  const [query, setQuery] = useState("");
  const [scope, animate] = useAnimate();

  const [errors, setErrors] = useState<any>(null);

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

  const onSuggest = (query: string) => {
    setQuery(query);
    animate(scope.current, {
      scale: [1.2, 1.0],
    });
  };

  const onSubmit = async (event: FormEvent) => {
    onPending();
    event.preventDefault();

    const response = await fetch("/api/query/", {
      method: "POST",
      body: new FormData(event.target as HTMLFormElement),
    });
    const value = await response.json();
    if (response.ok) {
      onResponse(value);
      setErrors(null);
    } else {
      setErrors(value);
    }
  };

  return (
    <form className="form block" onSubmit={onSubmit}>
      <Field>
        <Label>{"Explain Like I'm A:"}</Label>
        <Control>
          <ButtonChoice name="audience" choices={audienceChoices} />
        </Control>
        <Help>{"The target audience for ELI's responses."}</Help>
        <ErrorList errors={errors?.audience} />
      </Field>

      <Field>
        <Label>{"AI Model:"}</Label>
        <Control>
          <Select name="ai_model_name" choices={aiModelChoices} />
        </Control>
        <Help>The AI model to use for generating responses.</Help>
        <ErrorList errors={errors?.ai_model_name} />
      </Field>

      <Field className="is-grouped is-grouped-right">
        <Control className="is-expanded">
          <motion.input
            ref={scope}
            name="query"
            autoComplete="off"
            className="input"
            placeholder="Query. e.g. 'What is a cat?'"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
        </Control>
        <Control>
          <button className="button is-primary">
            <Symbol name="send" />
          </button>
        </Control>
      </Field>
      <ErrorList errors={errors?.query} />
      <QuerySuggestions onSuggest={onSuggest} />
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
    console.log("response", response);
    setPending(false);
    setConversation(response);
  };

  return (
    <>
      <section className="section">
        <Form onPending={onPending} onResponse={onResponse} />
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
