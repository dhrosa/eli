import { createRoot } from 'react-dom/client';
import {ConversationListPage} from './ConversationListPage';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(<ConversationListPage />);
