import React from 'react';
import ReactDOM from 'react-dom/client';
import { NewTodo, TodoCard, NewTemplate } from './Todo';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TodoCard id={4} title={"qwq"}/>
      <NewTodo />
  </React.StrictMode>
);

