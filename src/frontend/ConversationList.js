import React from 'react';
import { createRoot } from 'react-dom/client';

ConversationList = () => {
  return (
    <div>
      <h1>Hello, React with Webpack!</h1>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));

root.render(<ConverationList/>);
