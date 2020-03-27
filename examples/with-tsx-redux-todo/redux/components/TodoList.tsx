import React from 'react';
import TodoComponent from './Todo';
import { Todo } from '../types';

interface TodoListProps {
  todos: Todo[],
  toggleTodo: (id: number) => {};
}

const TodoList = ({ todos, toggleTodo }: TodoListProps): React.ReactElement => (
  <ul>
    {todos.map(todo =>
      <TodoComponent
        key={todo.id}
        {...todo}
        onClick={() => toggleTodo(todo.id)}
      />
    )}
  </ul>
);

export default TodoList;
