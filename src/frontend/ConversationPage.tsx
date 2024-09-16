import { useEffect, useState } from "react";
import Conversation from "./Conversation";
import * as Api from "./Api";

export default function ConversationPage() {
  const [data, setData] = useState(null);
  useEffect(() => {
    const get = async () => {
      const response = await Api.Conversation.list();
      setData(response.value);
    };
    get().catch(console.error);
  }, []);
  return (
    <section className="section">
      <Conversation object={data} />
    </section>
  );
}
