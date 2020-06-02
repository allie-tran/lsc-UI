import { combineReducers } from 'redux';
import search, { searchState } from './search';
import save from './save';
import select, { selectState } from './select';
import { NEXT_QUERY, EXPORT_SAVED, START_TIMER, DISABLE } from '../actions/submit';
import axios from 'axios';

const appReducer = combineReducers({
	search,
	save,
	select
});

const rootReducer = (state, action) => {
	if (action.type === NEXT_QUERY || action.type === EXPORT_SAVED) {
		document.getElementById('Before:').value = null;
		document.getElementById('Before:-when').value = null;
		document.getElementById('Find:').value = null;
		document.getElementById('After:').value = null;
		document.getElementById('After:-when').value = null;
	}
	if (action.type === NEXT_QUERY) {
        var newQuery = state.save.currentQuery + 1;
        if (newQuery > 10) {
            newQuery = 1;
        }

        return {
            save: {
                ...state.save,
                currentQuery: newQuery,
                saved: state.save.saved.length === 0 ? state.save.saved : [],
                timerRunning: false,
                saveResponse: axios.post('http://localhost:7999/api/getsaved?query_id=' + newQuery),
            },
            search: searchState,
            select: selectState
		}
	} else if (action.type === EXPORT_SAVED) {
		return {
			save: {
                ...state.save,
				currentQuery: state.save.currentQuery,
                timerRunning: false,
                saveResponse: null
			},
			search: searchState,
			select: selectState
		};
	}
    else if (action.type === START_TIMER) {
		return {
            ...state,
            save: {...state.save,
                    timerRunning: true}
        }
	}
    else if (action.type === DISABLE) {
        var newFinished = state.save.finished.slice()
        newFinished[state.save.currentQuery - 1] = true
		return {
            ...state,
            save: {...state.save,
                    finished: newFinished}
        }
	}
	return state;
};

export default function(state, action) {
	const intermediateState = appReducer(state, action);
	return rootReducer(intermediateState, action);
}
