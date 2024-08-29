import { createRoot } from 'react-dom/client';
import {ConversationListPage} from './ConversationListPage';
import {ConversationPage} from './ConversationPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const domNode = document.getElementById('root');
const root = createRoot(domNode);



root.render(
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/c" element={<ConversationListPage />}/>
                <Route path="/c/:id" element={<ConversationPage />}/>
            </Routes>
        </BrowserRouter>
    </>
)
