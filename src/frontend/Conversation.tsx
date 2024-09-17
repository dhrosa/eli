import { Link } from "react-router-dom";
import { ReactNode } from "react";
/* global require */
const humanizeDuration = require("humanize-duration");

function Timestamp({ timestamp }: { timestamp: string }) {
  if (!timestamp) {
    return false;
  }
  const date = new Date(timestamp);
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
    <div className={"content " + (text ? "" : "is-skeleton")}>
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

function Avatar() {
  return (
    <p className="image is-64x64">
      <img src="https://bulma.io/assets/images/placeholders/64x64.png" />
    </p>
  );
}

function Media({ children }: { children: ReactNode }) {
  return (
    <article className="media">
      <figure className="media-left">
        <Avatar />
      </figure>
      {children}
    </article>
  );
}

function MediaContent({ children }: { children: ReactNode }) {
  return <div className="media-content">{children}</div>;
}

function CardHeader({ title, url }: { title?: string; url?: string }) {
  return (
    <div className="card-header">
      <p className="card-header-title">{title ?? "Loading..."}</p>
      <div className="card-header-icon">
        <Link to={url ?? ""} className={"icon " + (url ? "" : "is-skeleton")}>
          <span className="material-icons">link</span>
        </Link>
      </div>
    </div>
  );
}

export default function Conversation({ object }: { object: any }) {
  return (
    <div className="card">
      <CardHeader title={object?.response_title} url={object?.url} />
      <div className="card-content">
        <Media>
          <MediaContent>
            <Quote
              author={object?.audience_name}
              text={object?.query}
              timestamp={object?.timestamp}
            />
            <Media>
              <MediaContent>
                <Quote
                  author="ELI"
                  text={object?.response_text}
                  timestamp={object?.timestamp}
                />
              </MediaContent>
            </Media>
          </MediaContent>
        </Media>
      </div>
    </div>
  );
}
