import { connect } from 'react-redux';
import { toggleTodo } from '../actions';
import TodoList from '../components/TodoList';
import { TodoState } from '../types';

const mapStateToProps = (state: TodoState) => ({
  todos: state.todos,
})

const mapDispatchToProps = (dispatch: any) => ({
  toggleTodo: (id: number) => dispatch(toggleTodo(id))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TodoList);
