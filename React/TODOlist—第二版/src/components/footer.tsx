import * as React from "react"
import FilterLink from "../containers/filter"
import { SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED } from "../actions/creator"
import { ComponentType } from "../types/index"

const Footer: ComponentType.Footer = ({ all, active, completed }) => {
  return (
    <div>
      <span>show: </span>
      <FilterLink filter={SHOW_ALL}> {`All (${all < 10 ? "0" + all : all})`} </FilterLink>
      <FilterLink filter={SHOW_ACTIVE}> {`Active (${active < 10 ? "0" + active : active})`} </FilterLink>
      <FilterLink filter={SHOW_COMPLETED}> {`Completed (${completed < 10 ? "0" + completed : completed})`} </FilterLink>
    </div>
  )
}

export default Footer
