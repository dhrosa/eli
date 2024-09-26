import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetSet } from "react-use";

export default function QuerySuggestions({
  onSuggest,
}: {
  onSuggest: (query: string) => void;
}) {
  const [suggestions, setSuggestions] = React.useState([]);
  const [getDirty, setDirty] = useGetSet(true);

  const dirty = getDirty();
  const getSuggestions = async () => {
    const response = await fetch("/api/query/suggest/", {
      headers: { Accept: "application/json" },
    });
    const newSuggestions = await response.json();
    if (!getDirty()) {
      return;
    }
    setSuggestions(newSuggestions);
    setDirty(false);
    return suggestions;
  };

  React.useEffect(() => {
    getSuggestions().catch((error: unknown) => {
      console.error(error);
    });
  }, [dirty]);

  return (
    <div className="suggestions block">
      {suggestions.map((s, i) => (
        <AnimatePresence key={i}>
          <motion.button
            layout
            className="button"
            initial={{ opacity: 0, scale: 0.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.1 }}
            type="button"
            onClick={() => {
              onSuggest(s);
            }}
          >
            {s}
          </motion.button>
        </AnimatePresence>
      ))}
      <motion.button
        layout
        className={"button"}
        type="button"
        onClick={() => {
          setDirty(true);
        }}
      >
        {dirty ? (
          <>
            Loading suggestions &nbsp;
            <span className="is-loading" />
          </>
        ) : (
          "More suggestions ..."
        )}
      </motion.button>
    </div>
  );
}
