import { useEffect, useState } from 'react';
import {Conversation} from './Conversation';

function ConversationList() {
    const [dataList, setDataList] = useState([]);
    useEffect(() => {
        const fetchList = async () => {
            const data = await fetch("/api/conversations/");
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
