import { useEffect, useState } from 'react';

function Details({data}) {
    return (
        <details>
            <summary>Details</summary>
        </details>
    );
}

function Conversation({data}) {
    return (
        <article className="conversation">
            <header>
                <a class="material-icons" href="{data.url}">link</a>
                &nbsp;
                {data.response_title}
            </header>
            <blockquote>
                {data.query}
                <footer>
                    <cite>
                        - {data.audience_name} @ {data.timestamp}
                    </cite>
                </footer>
            </blockquote>
            <blockquote>
                {data.response_text}
                <footer>
                    <cite>- ELI ({data.ai_model_name})</cite>
                </footer>
            </blockquote>
            <Details data={data}/>
        </article>
    )
}

function ConversationList() {
    const [dataList, setDataList] = useState([]);
    useEffect(() => {
        const fetchList = async () => {
            const data = await fetch("/api/conversations");
            setDataList(await data.json());
        };

        fetchList().catch(console.error);
    }, []);
    const tags = dataList.map(c => <Conversation data={c}/>)
    return (
        <div>
            {tags}
        </div>
    )
}

function ConversationListPage() {
    return (
        <ConversationList/>
    );
};

export {ConversationListPage};
