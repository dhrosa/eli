import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Conversation from "./Conversation";

export default function () {
  const { id } = useParams();
  const [data, setData] = useState(null);
  useEffect(() => {
    const get = async () => {
      const response = await fetch(`/api/conversations/${id}/`);
      setData(await response.json());
    };
    get().catch(console.error);
  }, []);
  return (
    <section class="section">
      <Conversation data={data} />
    </section>
  );
}
