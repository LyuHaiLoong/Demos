import { delTodo, toggleTodo } from "../actions/index"
import { connect } from "react-redux"
import { SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED } from "../actions/creator"
import TodoList from "../components/todoList"
import { ContainersType } from "../types/index"

const showAll: ContainersType.Show = todos => todos

const showActive: ContainersType.Show = todos =>
  todos.filter(todo => !todo.completed)

const showCompleted: ContainersType.Show = todos =>
  todos.filter(todo => todo.completed)

const getFilter: ContainersType.Filter = (todos, filter) => {
  switch (filter) {
    case SHOW_ACTIVE:
      return showActive(todos)
    case SHOW_COMPLETED:
      return showCompleted(todos)
    case SHOW_ALL:
    default:
      return showAll(todos)
  }
}

const mapStateToProps: ContainersType.MapStateToProps_TodoList = state => ({
  todos: getFilter(state.todos, state.filter)
})
const mapDispatchToProps: ContainersType.MapDispatchToProps_TodoList = dispatch => ({
  toggleTodo: id => dispatch(toggleTodo(id)),
  delTodo: id => dispatch(delTodo(id))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)
