import * as React from "react"
import Todo from "./todo"
import { ComponentType } from "../types/index"

const TodoList: ComponentType.TodoList = ({ todos, toggleTodo, delTodo }) => {
  return (
    <ul>
      {todos.map(todo => {
        return (
          <Todo
            key={todo.id}
            {...todo}
            toggle={() => toggleTodo(todo.id)}
            del={() => delTodo(todo.id)}
          />
        )
      })}
    </ul>
  )
}

export default TodoList;
