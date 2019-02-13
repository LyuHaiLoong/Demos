import { ActionsType } from "../types/index"

export const ADD_TODO: Readonly<string> = "ADD_TODO"
export const DEL_TODO: Readonly<string> = "DEL_TODO"
export const TOGGLE_TODO: Readonly<string> = "TOGGLE_TODO"
export const SET_FILTER: Readonly<string> = "SET_FILTER"
export const UNDO: Readonly<string> = "UNDO"
export const REDO: Readonly<string> = "REDO"
export const SHOW_ALL: Readonly<string> = "SHOW_ALL"
export const SHOW_COMPLETED: Readonly<string> = "SHOW_COMPLETED"
export const SHOW_ACTIVE: Readonly<string> = "SHOW_ACTIVE"

let id: ActionsType.Id = 0
export const actionCreator: ActionsType.Creator = (type, key) => {
  return prop => {
    const result = { type }

    if (type === ADD_TODO) {
      result["id"] = id
      id++
    }
    if (key === undefined) return result

    result[key] = prop

    return result
  }
}
