import React from 'react';
import ReactDOM from 'react-dom/client';
// import TodoCard from './Todo';
import TodoList from './List'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <TodoList />
  </React.StrictMode>
);

