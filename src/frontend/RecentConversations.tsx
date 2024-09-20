import { useEffect, useReducer, useState, KeyboardEvent } from "react";
import { default as Conversation, ConversationData } from "./Conversation";
import * as Api from "./Api";

import { motion, AnimatePresence } from "framer-motion";

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
  direction: "left" | "right";
}

type Action = ResetAction | RotateAction;

export default function RecentConversations() {
  const [state, dispatch] = useReducer(reducer, {
    conversations: [],
    currentIndex: 0,
  });
  const [focused, setFocused] = useState(false);

  // Load initial list.
  useEffect(() => {
    const fetchList = async () => {
      const response = await Api.Conversation.list();
      if (response.error) {
        console.error(response.error);
        return;
      }
      dispatch({ type: "reset", value: response.value });
    };
    fetchList().catch((e: unknown) => {
      console.error(e);
    });
  }, []);

  if (state.conversations.length === 0) {
    return <div className="skeleton-block" />;
  }
  const current = state.conversations[state.currentIndex];

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    console.log(event);
    if (!focused) {
      return;
    }
    if (event.key === "ArrowRight") {
      dispatch({ type: "rotate", direction: "right" });
    }
    if (event.key === "ArrowLeft") {
      dispatch({ type: "rotate", direction: "left" });
    }
  };

  return (
    <div
      className="recent"
      onKeyDown={onKeyDown}
      tabIndex={0}
      onFocus={() => {
        setFocused(true);
      }}
      onBlur={() => {
        setFocused(false);
      }}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={current.id}
          initial={{ x: 1000, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -1000, opacity: 0 }}
        >
          <Conversation object={current} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "reset":
      return { conversations: action.value, currentIndex: 0 };
    case "rotate": {
      const increment = action.direction === "right" ? 1 : -1;
      const n = state.conversations.length;
      const newIndex = (state.currentIndex + increment + n) % n;
      return { ...state, currentIndex: newIndex };
    }
    default:
      return state;
  }
}
