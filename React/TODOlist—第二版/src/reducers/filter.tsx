import * as Reducers from "./creator"
import * as Actions from "../actions/creator"
import { ReducersType } from "../types/index"

const handlers: ReducersType.FilterHandler = {
  [Actions.SET_FILTER]: Reducers.filter
}

const filterReducer: ReducersType.FilterReducer = Reducers.createReducers(Actions.SHOW_ALL, handlers)

export default filterReducer;
