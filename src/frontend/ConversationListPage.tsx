import { useEffect, useState } from "react";
import Conversation from "./Conversation";
import * as Api from "./Api";

export default function ConversationListPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  useEffect(() => {
    const fetchList = async () => {
      const response = await Api.Conversation.list();
      setConversations(response.value);
    };

    fetchList().catch(console.error);
  }, []);
  return (
    <section className="section">
      {conversations.map((c) => (
        <Conversation object={c} key={c.id} />
      ))}
    </section>
  );
}
