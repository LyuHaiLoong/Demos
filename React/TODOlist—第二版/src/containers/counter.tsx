import { connect } from "react-redux"
import Footer  from "../components/footer"
import { ContainersType } from "../types/index"

const countAll: ContainersType.Counter = todos => todos.length
const countActive: ContainersType.Counter = todos => (todos.filter(todo => !todo.completed)).length
const countCompleted: ContainersType.Counter = todos => (todos.filter(todo => todo.completed)).length

const mapStateToProps: ContainersType.MapStateToProps_Counter = state => ({
  all: countAll(state.todos),
  active: countActive(state.todos),
  completed: countCompleted(state.todos)
})

export default connect(
  mapStateToProps
)(Footer)