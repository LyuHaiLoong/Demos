import * as React from "react"
import { ComponentType } from "../types/index"

const Link: ComponentType.Link = ({ children, showFilter, active }) => {
  return (
    <button
      style={{ marginLeft: "5px" }}
      disabled={active}
      onClick={showFilter}
    >
      {children}
    </button>
  )
}

export default Link
