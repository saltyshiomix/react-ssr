import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { addTodo } from '../actions';

const AddTodo = ({ dispatch }: DispatchProp) => {
  let input: HTMLInputElement;

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault();
        if (!input.value.trim()) {
          return;
        }
        dispatch(addTodo(input.value));
        input.value = '';
      }}>
        <input ref={node => node && (input = node)} />
        <button type="submit">
          Add Todo
        </button>
      </form>
    </div>
  );
}

export default connect()(AddTodo);
