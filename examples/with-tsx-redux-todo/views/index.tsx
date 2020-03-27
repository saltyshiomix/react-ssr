import React from 'react';
import { createStore } from 'redux'
import { Provider } from 'react-redux';
import AddTodo from '../redux/containers/AddTodo';
import TodoList from '../redux/containers/TodoList';
import rootReducer from '../redux/reducers';
import { Todo } from '../redux/types';

interface IndexPageProps {
  todos: Todo[];
};

const IndexPage = (props: IndexPageProps) => {
  // use server data as preloaded state
  const preloadedState = {
    todos: props.todos,
  };

  const store = createStore(rootReducer, preloadedState);

  return (
    <Provider store={store}>
      <AddTodo />
      <TodoList />
    </Provider>
  );
};

export default IndexPage;
