import * as React from "react"
import { connect } from "react-redux"
import { addTodo } from "../actions/index"
import { ContainersType } from "../types/index"

const AddTodo: ContainersType.AddTodo = ({ dispatch }) => {
  let input: HTMLInputElement | null

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        if (!input) return
        if (!input.value.trim()) return
        dispatch(addTodo(input.value))
        input.value = ""
      }}
    >
      <input
        type="text"
        placeholder="请输入要添加的内容"
        ref={dom => (input = dom)}
      />
      <button type="submit">addTodo</button>
    </form>
  )
}

export default connect()(AddTodo)
