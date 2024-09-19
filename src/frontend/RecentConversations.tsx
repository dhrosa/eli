import { useEffect, useReducer, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { default as Conversation, ConversationData } from "./Conversation";
import * as Api from "./Api";

interface State {
  conversations: ConversationData[];
  currentIndex: number;
}

interface ResetAction {
  type: "reset";
  value: ConversationData[];
}

interface RotateAction {
  type: "rotate";
}

type Action = ResetAction | RotateAction;

export default function RecentConversations() {
  const [state, dispatch] = useReducer(reducer, {
    conversations: [],
    currentIndex: 0,
  });
  const ref = useRef(null);

  // Load initial list.
  useEffect(() => {
    const fetchList = async () => {
      const response = await Api.Conversation.list();
      if (response.error) {
        console.error(response.error);
        return;
      }
      dispatch({ type: "reset", value: response.value });
      setTimeout(rotate, timeout_ms);
    };
    fetchList().catch((e: unknown) => {
      console.error(e);
    });
  }, []);

  const timeout_ms = 3000;
  const rotate = () => {
    dispatch({ type: "rotate" });
    setTimeout(rotate, timeout_ms);
  };

  if (state.conversations.length === 0) {
    return <div className="skeleton-block" />;
  }
  const current = state.conversations[state.currentIndex];

  return (
    <>
      <CSSTransition
        key={current.id}
        className="slide"
        timeout={2500}
        appear={true}
        nodeRef={ref}
      >
        <Conversation ref={ref} object={current} />
      </CSSTransition>
    </>
  );
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "reset":
      return { conversations: action.value, currentIndex: 0 };
    case "rotate": {
      const newIndex = (state.currentIndex + 1) % state.conversations.length;
      return { ...state, currentIndex: newIndex };
    }
    default:
      return state;
  }
}
