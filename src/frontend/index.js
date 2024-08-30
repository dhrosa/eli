import { createRoot } from 'react-dom/client';
import {ConversationListPage} from './ConversationListPage';
import {ConversationPage} from './ConversationPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {QueryPage} from './QueryPage';

const root = createRoot(document.getElementById('main'));

root.render(
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<QueryPage />}/>
                <Route path="/c" element={<ConversationListPage />}/>
                <Route path="/c/:id" element={<ConversationPage />}/>
            </Routes>
        </BrowserRouter>
    </>
)

