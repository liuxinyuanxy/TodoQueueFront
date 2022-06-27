import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import User from './User';
// import TodoCard from './Todo';
import TodoList from './List'
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <TodoCard id={4} title={"qwq"}/> */}
    <TodoList />
  </React.StrictMode>
);

