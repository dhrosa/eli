import React from "react";

function Suggestion({ text }: { text: string }) {
  return <button className="button">{text}</button>;
}

export default function QuerySuggestion() {
  const [suggestions, setSuggestions] = React.useState([]);

  const getSuggestions = async () => {
    const response = await fetch("/api/query/suggest/", {
      headers: { Accept: "application/json" },
    });
    const newSuggestions = await response.json();
    setSuggestions((prev) => (prev.length > 0 ? prev : newSuggestions));
    return suggestions;
  };

  React.useEffect(() => {
    getSuggestions().catch((error: unknown) => {
      console.error(error);
    });
  }, []);

  return (
    <div className="suggestions block">
      {suggestions.map((s) => (
        <Suggestion key={s} text={s} />
      ))}
    </div>
  );
}
