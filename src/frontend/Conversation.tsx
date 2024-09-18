import { Link } from "react-router-dom";
import { ReactNode, useContext, createContext } from "react";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const humanizeDuration = require("humanize-duration");

interface ConversationData {
  id: string;
  url: string;
  audience_name: string;
  ai_model_name: string;
  query: string;
  timestamp: string;
  response_title: string;
  response_text: string;
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
}: {
  author: string;
  text: string;
  timestamp: string;
}) {
  return (
    <div className="content">
      <p>
        <strong>{author}</strong>
        <Timestamp timestamp={timestamp} />
        <br />
        {text}
        <br />
      </p>
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
    <Quote
      author="ELI"
      text={conversation.response_text}
      timestamp={conversation.timestamp}
    />
  );
}

function Avatar() {
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
  const url = `/static/jsx/assets/interfaces/${indexStr}.jpg`;
  return (
    <p className="image is-64x64">
      <img src={url} />
    </p>
  );
}

function Media({
  children,
  isUser = false,
}: {
  children: ReactNode;
  isUser?: boolean;
}) {
  return (
    <article className="media">
      <figure className="media-left">
        {isUser ? <UserAvatar /> : <Avatar />}
      </figure>
      {children}
    </article>
  );
}

function MediaContent({ children }: { children: ReactNode }) {
  return <div className="media-content">{children}</div>;
}

function CardHeader() {
  const conversation = useContext(ConversationContext);
  return (
    <div className="card-header">
      <p className="card-header-title">{conversation.response_title}</p>
      <div className="card-header-icon">
        <Link to={conversation.url} className="icon">
          <span className="material-icons">link</span>
        </Link>
      </div>
    </div>
  );
}

export default function Conversation({ object }: { object: any }) {
  if (!object) {
    return <div className="skeleton-block" />;
  }
  return (
    <ConversationContext.Provider value={object as ConversationData}>
      <div className="card">
        <CardHeader />
        <div className="card-content">
          <Media isUser={true}>
            <MediaContent>
              <UserQuote />
              <Media>
                <MediaContent>
                  <EliQuote />
                </MediaContent>
              </Media>
            </MediaContent>
          </Media>
        </div>
      </div>
    </ConversationContext.Provider>
  );
}
