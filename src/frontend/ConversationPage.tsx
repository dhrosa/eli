import { useEffect, useState } from "react";
import Conversation from "./Conversation";
import { useParams } from "react-router-dom";
import * as Api from "./Api";

export default function ConversationPage() {
  const [data, setData] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    const get = async () => {
      const response = await Api.Conversation.detail(id ?? "");
      setData(response.value);
    };
    get().catch((e: unknown) => {
      console.error(e);
    });
  }, []);
  return (
    <section className="section">
      <Conversation object={data} />
    </section>
  );
}
