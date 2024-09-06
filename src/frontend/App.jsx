import "./App.scss";

import ConversationPage from "./ConversationPage";
import ConversationListPage from "./ConversationListPage";
import { Routes, Route } from "react-router-dom";
import QueryPage from "./QueryPage";
import RulesPage from "./RulesPage";
import Nav from "./Nav";

export default function () {
  return (
    <div className="container">
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<QueryPage />} />
          <Route path="/rules/" element={<RulesPage />} />
          <Route path="/c/" element={<ConversationListPage />} />
          <Route path="/c/:id/" element={<ConversationPage />} />
        </Routes>
      </main>
    </div>
  );
}
