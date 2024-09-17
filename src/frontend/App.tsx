import "./App.scss";

import ConversationPage from "./ConversationPage";
import ConversationListPage from "./ConversationListPage";
import { Routes, Route } from "react-router-dom";
import QueryPage from "./QueryPage";
import AudiencesPage from "./AudiencesPage";
import RulesPage from "./RulesPage";
import Nav from "./Nav";
import { UserContext, UserDispatchContext, userReducer, initialUser } from "./UserContext";
import { useReducer } from "react";
import {
  notificationReducer,
  NotificationContext,
  NotifyContext,
  RenderedNotificationList,
} from "./Notification";

export default function App() {
  const [user, dispatch] = useReducer(userReducer, initialUser());
  const [notifications, notify] = useReducer(notificationReducer, []);

  return (
    <NotificationContext.Provider value={notifications}>
      <NotifyContext.Provider value={notify}>
        <UserContext.Provider value={user}>
          <UserDispatchContext.Provider value={dispatch}>
            <div className="container">
              <Nav />
              <RenderedNotificationList />
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
      </NotifyContext.Provider>
    </NotificationContext.Provider>
  );
}