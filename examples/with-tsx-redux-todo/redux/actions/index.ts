let nextTodoId = 3;

interface AddTodo {
  type: 'ADD_TODO';
  id: number;
  text: string;
}

interface ToggleTodo {
  type: 'TOGGLE_TODO';
  id: number;
}

export const addTodo = (text: string): AddTodo => ({
  type: 'ADD_TODO',
  id: nextTodoId++,
  text,
});

export const toggleTodo = (id: number): ToggleTodo => ({
  type: 'TOGGLE_TODO',
  id,
});

export type TodoActionType = AddTodo | ToggleTodo;
