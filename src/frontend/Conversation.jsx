import { Link } from "react-router-dom";

function Quote({ author, text }) {
  const skeletonClass = text ? "" : "is-skeleton";
  return (
    <div className={"content " + skeletonClass}>
      <p>
        <strong>{author}</strong>
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

function MediaRight({ url }) {
  const className = "media-right " + (url ? "" : "is-skeleton");
  return (
    <div className={className}>
      <Link to={url} className="card-header-icon icon">
        <span className="material-icons">link</span>
      </Link>
    </div>
  );
}

function CardHeader({ title }) {
  const contents = title ?? "Loading...";
  return (
    <div className="card-header">
      <p className="card-header-title">{contents}</p>
    </div>
  );
}

export default function ({ data }) {
  return (
    <div className="card">
      <CardHeader title={data?.response_title} />
      <div className="card-content">
        <Media>
          <MediaContent>
            <Quote author={data?.audience_name} text={data?.query} />
            <Media>
              <MediaContent>
                <Quote author="ELI" text={data?.response_text} />
              </MediaContent>
            </Media>
          </MediaContent>
        </Media>
      </div>
    </div>
  );
}
