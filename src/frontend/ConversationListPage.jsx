import { useEffect, useState } from "react";
import Conversation from "./Conversation";
import * as Api from "./Api";

function ConversationList() {
  const [dataList, setDataList] = useState([]);
  useEffect(() => {
    const fetchList = async () => {
      const response = await Api.Conversation.list();
      setDataList(response.value);
    };

    fetchList().catch(console.error);
  }, []);
  const tags = dataList.map((c) => <Conversation object={c} key={c.id} />);
  return <section className="section">{tags}</section>;
}

export default function () {
  return <ConversationList />;
}
