import * as React from "react"
import AddTodo from "../containers/addTodo"
import Footer from "../containers/counter"
import TodoList from "../containers/todoList"
import { ComponentType } from "../types/index"

const App: ComponentType.App = () => {
  return (
    <>
      <AddTodo />
      <Footer />
      <TodoList />
    </>
  )
}

export default App
