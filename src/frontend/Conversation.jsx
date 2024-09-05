import { Link } from "react-router-dom";

function Quote({ author, text }) {
  return (
    <div className="content">
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

function MediaObject({ children }) {
  return (
    <article className="media">
      <figure className="media-left">
        <Avatar />
      </figure>
      {children}
    </article>
  );
}

export default function ({ data }) {
  return (
    <MediaObject>
      <div className="media-content">
        <Quote author={data.audience_name} text={data.query} />
        <MediaObject>
          <div className="media-content">
            <Quote author="ELI" text={data.response_text} />
          </div>
        </MediaObject>
      </div>
      <div className="media-right">
        <Link to={data.url} className="card-header-icon icon">
          <span className="material-icons">link</span>
        </Link>
      </div>
    </MediaObject>
  );
}
