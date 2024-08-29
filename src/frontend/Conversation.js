function Quote({text, author}) {
    return (
        <blockquote>
            {text}
            <footer><cite>- {author}</cite></footer>
        </blockquote>
    )
}

function Conversation({data}) {
    if (!data) {
        return (
            <article className="conversation" aria-busy="true">
            </article>
        );
    }
    return (
        <article className="conversation">
            <header>
                <a class="material-icons" href={data.url}>link</a>
                &nbsp;
                {data.response_title}
            </header>
            <Quote text={data.query} author={data.audience_name} />
            <Quote text={data.response_text} author={`ELI (${data.ai_model_name}})`} />
        </article>
    )
}

export {Conversation};
