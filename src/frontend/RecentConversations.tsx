import { useEffect, useReducer } from "react";

import { default as Conversation, ConversationData } from "./Conversation";
import * as Api from "./Api";

interface State {
  conversations: ConversationData[];
}

interface AppendAction {
  type: "append";
  value: ConversationData[];
}

type Action = AppendAction;

export default function RecentConversations() {
  const [state, dispatch] = useReducer(reducer, { conversations: [] });

  // Load initial list.
  useEffect(() => {
    const fetchList = async () => {
      const response = await Api.Conversation.list();
      if (response.error) {
        console.error(response.error);
        return;
      }
      dispatch({ type: "append", value: response.value });
    };
    fetchList().catch((e: unknown) => {
      console.error(e);
    });
  }, []);

  return (
    <>
      {state.conversations.map((c) => (
        <Conversation object={c} key={c.id} />
      ))}
    </>
  );
}

function reducer(state: State, action: Action): State {
  return {
    conversations: [...state.conversations, ...action.value],
  };
}
