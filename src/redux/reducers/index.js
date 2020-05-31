import { combineReducers } from 'redux';
import search, { searchState } from './search';
import save from './save';
import select, { selectState } from './select';
import { NEXT_QUERY, EXPORT_SAVED } from '../actions/submit';

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
		console.log(state.save.finished);
		if (state.save.finished.includes(false)) {
			var newQuery = state.save.currentQuery + 1;
			if (newQuery > state.save.finished.length) {
				newQuery = 1;
			}
            console.log(newQuery);
			while (state.save.finished[newQuery - 1]) {
				newQuery += 1;
				console.log(newQuery);
				if (newQuery > state.save.finished.length) {
					newQuery = 1;
				}
			}
			console.log(newQuery);
			return {
				save: {
					currentQuery: newQuery,
					saved: state.save.saved.length === 0 ? state.save.saved : [],
					finished: state.save.finished
				},
				search: searchState,
				select: selectState
			};
		}
	} else if (action.type === EXPORT_SAVED) {
		var currentQuery = state.save.currentQuery;
		if (currentQuery === undefined) {
			currentQuery = 0;
		}
		return {
			save: {
				currentQuery: state.save.currentQuery,
				saved: state.save.saved.length === 0 ? state.save.saved : [],
				finished: [
					...state.save.finished.slice(0, currentQuery - 1),
					true,
					...state.save.finished.slice(currentQuery)
				]
			},
			search: searchState,
			select: selectState
		};
	}
	return state;
};

export default function(state, action) {
	const intermediateState = appReducer(state, action);
	return rootReducer(intermediateState, action);
}
