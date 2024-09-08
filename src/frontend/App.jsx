import "./App.scss";

import ConversationPage from "./ConversationPage";
import ConversationListPage from "./ConversationListPage";
import { Routes, Route } from "react-router-dom";
import QueryPage from "./QueryPage";
import AudiencesPage from "./AudiencesPage";
import RulesPage from "./RulesPage";
import Nav from "./Nav";
import { UserContext, UserDispatchContext } from "./UserContext";
import { useReducer } from "react";

export default function () {
  const [user, dispatch] = useReducer(userReducer, null);
  return (
    <UserContext.Provider value={user}>
      <UserDispatchContext.Provider value={dispatch}>
        <div className="container">
          <Nav />
          <main>
            <Routes>
              <Route path="/" element={<QueryPage />} />
              <Route path="/audiences/" element={<AudiencesPage />} />
              <Route path="/rules/" element={<RulesPage />} />
              <Route path="/c/" element={<ConversationListPage />} />
              <Route path="/c/:id/" element={<ConversationPage />} />
            </Routes>
          </main>
        </div>
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}

function userReducer(user, action) {
  console.log(user, action);
  switch (action.type) {
    case "login": {
      return action.value;
    }
    case "logout": {
      return null;
    }
  }
}
