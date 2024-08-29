import { createRoot } from 'react-dom/client';
import {ConversationListPage} from './ConversationListPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const domNode = document.getElementById('root');
const root = createRoot(domNode);



root.render(
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/c" element={<ConversationListPage />}/>
            </Routes>
        </BrowserRouter>
    </>
)
