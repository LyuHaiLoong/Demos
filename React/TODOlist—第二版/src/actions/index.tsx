import * as Actions from './creator';
import { ActionsType } from '../types/index';

export const addTodo: ActionsType.Creator_Return = Actions.actionCreator(Actions.ADD_TODO, "text");
export const delTodo: ActionsType.Creator_Return = Actions.actionCreator(Actions.DEL_TODO, "id");
export const toggleTodo: ActionsType.Creator_Return = Actions.actionCreator(Actions.TOGGLE_TODO, "id");
export const setFilter: ActionsType.Creator_Return = Actions.actionCreator(Actions.SET_FILTER, 'filter');
export const undo: ActionsType.Creator_Return = Actions.actionCreator(Actions.UNDO);
export const redo: ActionsType.Creator_Return = Actions.actionCreator(Actions.REDO);