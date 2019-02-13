import * as React from "react"
import { ComponentType } from "../types/index"

const Todo: ComponentType.Todo = ({ del, toggle, text, completed }) => {
  return (
    <li onClick={toggle}>
      <span style={{ textDecoration: completed ? "line-through" : "" }}>
        {text}
      </span>
      <span onClick={del} style={{ marginLeft: "20px" }}>
        x
      </span>
    </li>
  )
}

export default Todo
