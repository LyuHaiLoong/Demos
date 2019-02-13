// ---------------------------------
// ------------actions--------------
// ---------------------------------
export namespace ActionsType {
  // actions对象类型
  export interface Actions {
    type: string
  }
  export interface AddAction extends Actions {
    id: number
    text: string
  }
  export interface DelAction extends Actions {
    id: number
  }
  export interface ToggleAction extends DelAction {}
  export interface FilterAction extends Actions {
    filter: string
  }
  // 数据id类型
  export type Id = number
  // creator函数类型
  export type Return =
    | Actions
    | AddAction
    | DelAction
    | ToggleAction
    | FilterAction
  export type Creator_Return = (prop: number | string | void) => Return
  export type Creator = (type: string, key: string | void) => Creator_Return
}

// ---------------------------------
// ------------reducers-------------
// ---------------------------------
export namespace ReducersType {
  // state对象基础类型
  export interface TodoState {
    id: number
    text: string
    completed: boolean
  }
  // state切片类型
  // todo数组
  export type ArrayState = Array<TodoState>
  // filter字符串
  export type FilterState = string
  // 前进后退操作timing字符串
  export type TimingState = string
  // reducers函数类型
  export type AddReducer = (
    state: ArrayState,
    action: ActionsType.AddAction
  ) => ArrayState

  export type DelReducer = (
    state: ArrayState,
    action: ActionsType.DelAction
  ) => ArrayState

  export type ToggleReducer = (
    state: ArrayState,
    action: ActionsType.ToggleAction
  ) => ArrayState

  export type FilterReducer = (
    state: FilterState,
    action: ActionsType.FilterAction
  ) => FilterState
  export type TimingReducer = (
    state: TimingState,
    action: ActionsType.Actions
  ) => TimingState
  // 方法对象类型
  export interface TodoHandler {
    [index: string]: AddReducer | DelReducer | ToggleReducer
  }
  export interface FilterHandler {
    [index: string]: FilterReducer | TimingReducer
  }
  // creator函数类型，参数类型无法一一对应，只能使用函数重载，实现对应逻辑
  // export type Creator = (
  //   initialState: ArrayState | FilterState,
  //   handler: TodoHandler | FilterHandler
  // ) => AddReducer | DelReducer | ToggleReducer
  // Action联合类型
  export type Action = ActionsType.Return
}

// ---------------------------------
// -----------components------------
// ---------------------------------
export namespace ComponentType {
  // App
  export type App = () => JSX.Element
  // Footer
  interface FooterProps {
    all: number
    active: number
    completed: number
  }
  export type Footer = (props: FooterProps) => JSX.Element
  // Link
  interface LinkProps {
    children: string[]
    showFilter(): ActionsType.FilterAction
    active: boolean
  }
  export type Link = (props: LinkProps) => JSX.Element
  // Todo
  interface TodoProps {
    text: string
    completed: boolean
    del(): ActionsType.DelAction
    toggle(): ActionsType.ToggleAction
  }
  export type Todo = (props: TodoProps) => JSX.Element
  // TodoList
  interface TodoListProps {
    toggleTodo(id: number): ActionsType.ToggleAction
    delTodo(id: number): ActionsType.DelAction
    todos: ReducersType.ArrayState
  }
  export type TodoList = (props: TodoListProps) => JSX.Element
}

// ---------------------------------
// -----------containers------------
// ---------------------------------
export namespace ContainersType {
  // Dispatch联合类型
  type DispatchFilter = (action: ActionsType.Return) => ActionsType.FilterAction
  type DispatchTodoList = (
    action: ActionsType.Return
  ) => ActionsType.ToggleAction | ActionsType.DelAction
  // State公共类型
  interface State {
    todos: ReducersType.ArrayState
    filter: string
  }
  // AddTodo
  interface AddTodoProps {
    dispatch: any
  }
  export type AddTodo = (props: AddTodoProps) => JSX.Element
  // Counter
  export type Counter = (state: ReducersType.ArrayState) => number
  interface CounterState_Return {
    all: number
    active: number
    completed: number
  }
  export type MapStateToProps_Counter = (state: State) => CounterState_Return
  // Filter
  interface FilterProps {
    filter: string
  }
  interface FilterState_Return {
    active: boolean
  }
  interface FilterDispatch_Return {
    showFilter(): ActionsType.FilterAction
  }
  export type MapStateToProps_Filter = (
    state: State,
    ownProps: FilterProps
  ) => FilterState_Return
  export type MapDispatchToProps_Filter = (
    dispatch: DispatchFilter,
    ownProps: FilterProps
  ) => FilterDispatch_Return
  // TodoList
  interface TodoListState_Return {
    todos: ReducersType.ArrayState
  }
  interface TodoListDispatch_Return {
    delTodo(id: number): ActionsType.DelAction
    toggleTodo(id: number): ActionsType.ToggleAction
  }
  export type MapStateToProps_TodoList = (state: State) => TodoListState_Return
  export type MapDispatchToProps_TodoList = (
    dispatch: DispatchTodoList
  ) => TodoListDispatch_Return
  export type Show = (todos: ReducersType.ArrayState) => ReducersType.ArrayState
  export type Filter = (
    todos: ReducersType.ArrayState,
    filter: ReducersType.FilterState
  ) => ReducersType.ArrayState
}
