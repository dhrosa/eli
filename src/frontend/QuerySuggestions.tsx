import React from "react";

export default function QuerySuggestion({
  onSuggest,
}: {
  onSuggest: (query: string) => void;
}) {
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
        <button
          key={s}
          className="button"
          type="button"
          onClick={() => {
            onSuggest(s);
          }}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
