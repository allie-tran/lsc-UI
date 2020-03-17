import { combineReducers } from 'redux'
import search from './search'
import save from "./save";
import select from "./select";

export default combineReducers({
    search,
    save,
    select
})
