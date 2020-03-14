import { combineReducers } from 'redux'
import search from './search'
import save from "./save";

export default combineReducers({
    search,
    save
})