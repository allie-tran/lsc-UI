import { combineReducers } from "redux";
import search, { searchState } from "./search";
import save from "./save";
import select, { selectState } from "./select";
import submit, { submitState } from "./submit";

import {
    NEXT_QUERY,
    EXPORT_SAVED,
    START_TIMER,
    SET_TIMER,
    SET_SESSION_NAME,
} from "../actions/submit";

const appReducer = combineReducers({
    search,
    save,
    select,
    submit
});

const rootReducer = (state, action) => {
    if (action.type === NEXT_QUERY || action.type === EXPORT_SAVED) {
        document.getElementById("Before:").value = null;
        document.getElementById("Before:-when").value = null;
        document.getElementById("Find:").value = null;
        document.getElementById("After:").value = null;
        document.getElementById("After:-when").value = null;
    }
    if (action.type === SET_TIMER) {
        return {
            ...state,
            save: { ...state.save, time: action.time },
        };
    } else if (action.type === NEXT_QUERY) {
        var newQuery = state.save.currentQuery + 1;
        // var newFinished = state.save.finished.slice()
        // newFinished[state.save.currentQuery - 1] = state.save.time
        return {
            save: {
                ...state.save,
                currentQuery: newQuery,
                // saved: state.save.saved.length === 0 ? state.save.saved : [],
                timerRunning: false,
                // saveResponse: axios.post('http://localhost:8000/api/getsaved?query_id=' + newQuery),
                // finished: newFinished,
                // time: newFinished[newQuery - 1]
                time: 300,
            },
            search: { ...searchState },
            select: { ...selectState },
            submit: { ...submitState },
        };
    } else if (action.type === EXPORT_SAVED) {
        return {
            save: {
                ...state.save,
                timerRunning: false,
                saveResponse: null,
            },
            search: { ...searchState },
            select: { ...selectState },
            submit: { ...submitState },
        };
    } else if (action.type === START_TIMER) {
        return {
            ...state,
            save: { ...state.save, timerRunning: true },
        };
    } else if (action.type === SET_SESSION_NAME) {
        return {
            ...state,
            save: {
                ...state.save,
                sessionName: action.sessionName,
            },
        };
    }
    return state;
};

export default function (state, action) {
    const intermediateState = appReducer(state, action);
    return rootReducer(intermediateState, action);
}
