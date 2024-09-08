import { Link } from "react-router-dom";
const humanizeDuration = require("humanize-duration");

function Timestamp({ timestamp }) {
  if (!timestamp) {
    return false;
  }
  const date = new Date(timestamp);
  const duration = humanizeDuration(Date.now() - date.getTime(), {
    largest: 1,
    round: true,
  });
  return (
    <>
      <small>
        &nbsp; {date.toLocaleString()} ({duration} ago)
      </small>
    </>
  );
}

function Quote({ author, text, timestamp }) {
  const skeletonClass = text ? "" : "is-skeleton";
  return (
    <div className={"content " + skeletonClass}>
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

function Media({ children }) {
  return (
    <article className="media">
      <figure className="media-left">
        <Avatar />
      </figure>
      {children}
    </article>
  );
}

function MediaContent({ children }) {
  return <div className="media-content">{children}</div>;
}

function CardHeader({ title, url }) {
  return (
    <div className="card-header">
      <p className="card-header-title">{title ?? "Loading..."}</p>
      <div className="card-header-icon">
        <Link to={url} className={"icon " + (url ? "" : "is-skeleton")}>
          <span className="material-icons">link</span>
        </Link>
      </div>
    </div>
  );
}

export default function ({ object }) {
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
                <Quote author="ELI" text={object?.response_text} />
              </MediaContent>
            </Media>
          </MediaContent>
        </Media>
      </div>
    </div>
  );
}
