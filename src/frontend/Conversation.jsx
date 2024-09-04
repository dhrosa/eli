import { Link } from "react-router-dom";

function Quote({ text, author }) {
  return (
    <blockquote>
      {text}
      <footer>
        <cite>- {author}</cite>
      </footer>
    </blockquote>
  );
}

export default function ({ data }) {
  if (!data) {
    return <article className="conversation" aria-busy="true"></article>;
  }
  return (
    <article className="conversation">
      <header>
        <Link to={data.url} className="material-icons">
          link
        </Link>
        &nbsp;
        {data.response_title}
      </header>
      <Quote text={data.query} author={data.audience_name} />
      <Quote
        text={data.response_text}
        author={`ELI (${data.ai_model_name}})`}
      />
    </article>
  );
}
