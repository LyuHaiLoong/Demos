import { ReducersType } from '../types/index';

// createReducers，改用函数重载
// export const createReducers: ReducersType.Creator = (initialState, handler) => {
//   return (state = initialState, action: ReducersType.Action) => {
//     if (handler.hasOwnProperty(action.type)) {
//       return handler[action.type](state, action)
//     } else {
//       return state
//     }
//   }
// }
export function createReducers(initialState: ReducersType.ArrayState, handler: ReducersType.TodoHandler): ReducersType.AddReducer | ReducersType.ToggleReducer | ReducersType.DelReducer
export function createReducers(initialState: ReducersType.FilterState, handler: ReducersType.FilterHandler): ReducersType.FilterReducer
export function createReducers(initialState: any, handler: any) {
    return (state = initialState, action: ReducersType.Action) => {
    if (handler.hasOwnProperty(action.type)) {
      return handler[action.type](state, action)
    } else {
      return state
    }
  }
} 
// addTodo的reducer，返回添加新项目的新数组
export const addTodo: ReducersType.AddReducer = (state, action) => {
  return [
    ...state,
    {
      id: action.id,
      text: action.text,
      completed: false
    }
  ]
}
// toggleTodo的reducer，返回改变了completed状态的新数组
export const toggleTodo: ReducersType.ToggleReducer = (state, action) => {
  return state.map(todo => {
    return todo.id === action.id
      ? { ...todo, completed: !todo.completed }
      : todo
  })
}
// delTodo的reducer，返回过滤了删除项的新数组
export const delTodo: ReducersType.DelReducer = (state, action) => {
  return state.filter(todo => todo.id !== action.id)
}
// filter的reducer，返回显示状态
export const filter: ReducersType.FilterReducer = (state, action) => {
  return action.filter
}
