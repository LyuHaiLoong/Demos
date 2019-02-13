import * as Reducers from "./creator"
import { ADD_TODO, DEL_TODO, TOGGLE_TODO } from "../actions/creator"
import { ReducersType } from "../types/index"

const handlers: ReducersType.TodoHandler = {
  [ADD_TODO]: Reducers.addTodo,
  [DEL_TODO]: Reducers.delTodo,
  [TOGGLE_TODO]: Reducers.toggleTodo
}

const todoReducer:
  | ReducersType.AddReducer
  | ReducersType.DelReducer
  | ReducersType.ToggleReducer = Reducers.createReducers([], handlers)

export default todoReducer
