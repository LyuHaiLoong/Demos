import todos from "./todo"
import filter from "./filter"
import { combineReducers } from 'redux'

export default combineReducers({
  todos,
  filter
})