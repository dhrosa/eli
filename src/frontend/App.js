import "./App.scss";

import { ConversationPage } from './ConversationPage';
import { ConversationListPage } from './ConversationListPage';
import { Routes, Route } from 'react-router-dom'
import { QueryPage } from './QueryPage';
import { Nav } from './Nav';

function App() {
    return (
        <>
            <Nav/>
            <main className="container">
                <Routes>
                    <Route path="/" element={<QueryPage />}/>
                    <Route path="/c" element={<ConversationListPage />}/>
                    <Route path="/c/:id" element={<ConversationPage />}/>
                </Routes>
            </main>
        </>
    )
}

export {App};
