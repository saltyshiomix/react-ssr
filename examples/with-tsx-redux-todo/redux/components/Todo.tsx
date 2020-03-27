import React from 'react';

interface TodoProps {
  text: string;
  completed: boolean;
  onClick: () => {};
}

const Todo = ({ text, completed, onClick }: TodoProps): React.ReactElement => (
  <li
    onClick={onClick}
    style={{
      textDecoration: completed ? 'line-through' : 'none',
    }}
  >
    {text}
  </li>
);

export default Todo;
