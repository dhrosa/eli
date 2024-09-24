import "./App.scss";

import ConversationPage from "./ConversationPage";
import ConversationListPage from "./ConversationListPage";
import { Routes, Route } from "react-router-dom";
import QueryPage from "./QueryPage";
import AudiencesPage from "./AudiencesPage";
import RulesPage from "./RulesPage";
import Nav from "./Nav";
import { UserProvider } from "./User";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <UserProvider>
      <div className="container">
        <Nav />
        <ToastContainer theme="dark" />
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
    </UserProvider>
  );
}
