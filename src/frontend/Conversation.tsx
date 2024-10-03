import { Link } from "react-router-dom";
import {
  ReactNode,
  useContext,
  createContext,
  useEffect,
  useState,
} from "react";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const humanizeDuration = require("humanize-duration");
import { useCopyToClipboard, useInterval } from "react-use";
import { toast } from "react-toastify";
import Symbol from "./Symbol";
import { motion } from "framer-motion";
import Modal from "./Modal";

export interface ConversationData {
  id: string;
  url: string;
  audience_name: string;
  ai_model_name: string;
  query: string;
  timestamp: string;
  response_title: string;
  response_text: string;
  has_image: boolean;
}

const ConversationContext = createContext<ConversationData>(
  {} as ConversationData
);

function Timestamp({ timestamp }: { timestamp: string }) {
  if (!timestamp) {
    return false;
  }
  const date = new Date(timestamp);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const duration = humanizeDuration(Date.now() - date.getTime(), {
    largest: 1,
    round: true,
  });
  return (
    <small>
      &nbsp; {date.toLocaleString()} ({duration} ago)
    </small>
  );
}

function Quote({
  author,
  text,
  timestamp,
  children,
}: {
  author: string;
  text: string;
  timestamp: string;
  children?: ReactNode;
}) {
  return (
    <div className="content">
      <strong>{author}</strong>
      <Timestamp timestamp={timestamp} />
      <br />
      {children}
      {text}
      <br />
    </div>
  );
}

function UserQuote() {
  const conversation = useContext(ConversationContext);
  return (
    <Quote
      author={conversation.audience_name}
      text={conversation.query}
      timestamp={conversation.timestamp}
    />
  );
}

function EliQuote() {
  const conversation = useContext(ConversationContext);
  return (
    <>
      <Quote
        author="ELI"
        text={conversation.response_text}
        timestamp={conversation.timestamp}
      >
        {" "}
        <Image />
      </Quote>
    </>
  );
}

function Image() {
  const conversation = useContext(ConversationContext);
  const [modalActive, setModalActive] = useState(false);
  if (!conversation.has_image) {
    return false;
  }
  const url = `/api/conversations/${conversation.id}/image/`;
  return (
    <>
      <motion.div
        layout
        className="image is-square generated-image"
        whileHover={{ scale: 1.05 }}
      >
        <a
          onClick={() => {
            setModalActive(true);
          }}
        >
          <img src={url} />
        </a>
      </motion.div>
      <Modal
        active={modalActive}
        onClose={() => {
          setModalActive(false);
        }}
      >
        <a
          onClick={() => {
            setModalActive(false);
          }}
        >
          <img src={url} />
        </a>
      </Modal>
    </>
  );
}

function EliAvatar() {
  return (
    <p className="image is-64x64">
      <img src="https://bulma.io/assets/images/placeholders/64x64.png" />
    </p>
  );
}

function hash(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
  }
  return hash >>> 0;
}

function UserAvatar() {
  const conversation = useContext(ConversationContext);
  const count = 100;
  const index = (hash(conversation.id) % count) + 1;
  const indexStr = index.toString().padStart(3, "0");
  const url = `/static/jsx/assets/avatars/256x256/${indexStr}.jpg`;
  return (
    <p className="image is-64x64">
      <img src={url} />
    </p>
  );
}

function Media({
  children,
  avatar,
}: {
  children: ReactNode;
  avatar: ReactNode;
}) {
  return (
    <article className="media">
      <figure className="media-left">{avatar}</figure>
      {children}
    </article>
  );
}

function MediaContent({ children }: { children: ReactNode }) {
  return <div className="media-content">{children}</div>;
}

function Speech({ text }: { text: string }) {
  useInterval(() => {
    // Workaround for Chrome only dictating short bits of text: https://stackoverflow.com/questions/21947730/chrome-speech-synthesis-with-longer-texts#comment112224088_23808155
    speechSynthesis.pause();
    speechSynthesis.resume();
  }, 3000);
  useEffect(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
    return () => {
      speechSynthesis.cancel();
    };
  }, []);
  return <></>;
}

function CardHeader() {
  const conversation = useContext(ConversationContext);
  const [copyState, copyToClipboard] = useCopyToClipboard();
  const [speak, setSpeak] = useState(false);

  const url = new URL(conversation.url, window.location.origin);

  useEffect(() => {
    if (copyState.value) {
      toast.info(
        <p>
          Copied link to clipboard: &nbsp;{" "}
          <a href={copyState.value}>{copyState.value}</a>
        </p>
      );
    } else if (copyState.error) {
      toast.error("Failed to copy link to clipboard.");
      console.error(copyState);
    }
  }, [copyState]);

  return (
    <div className="card-header">
      <p className="card-header-title">
        {conversation.response_title}{" "}
        {speak && <Speech text={conversation.response_text} />}
      </p>
      <div className="card-header-icon">
        <a
          className="icon"
          onClick={() => {
            setSpeak(true);
          }}
        >
          <Symbol name="text_to_speech" />
        </a>
        <a
          onClick={() => {
            copyToClipboard(url.href);
          }}
          className="icon"
        >
          <Symbol name="link" />
        </a>
        <Link
          to={conversation.url}
          rel="noopener noreferrer"
          target="_blank"
          className="icon"
        >
          <Symbol name="open_in_new" />
        </Link>
      </div>
    </div>
  );
}

export default function Conversation({ object, ...rest }: any) {
  if (!object) {
    return <div className="skeleton-block" />;
  }
  return (
    <div className="conversation block" {...rest}>
      <ConversationContext.Provider value={object as ConversationData}>
        <div className="card">
          <CardHeader />
          <div className="card-content">
            <Media avatar={<UserAvatar />}>
              <MediaContent>
                <UserQuote />
                <Media avatar={<EliAvatar />}>
                  <MediaContent>
                    <EliQuote />
                  </MediaContent>
                </Media>
              </MediaContent>
            </Media>
          </div>
        </div>
      </ConversationContext.Provider>
    </div>
  );
}
