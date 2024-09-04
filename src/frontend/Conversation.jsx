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
  return (
      <div className="card">
          <div className="card-header">
              <p class="card-header-title">
                  {data.response_title}
                  <Link to={data.url} className="card-header-icon icon">
                      <span className="material-icons">link</span>
                  </Link>
              </p>              
          </div>
          <div className="card-content">
              <Quote text={data.query} author={data.audience_name} />
              <Quote
                  text={data.response_text}
                  author={`ELI (${data.ai_model_name}})`}
              />
          </div>
      </div>
  );
}
