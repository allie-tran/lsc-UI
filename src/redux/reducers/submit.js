import {
    NEXT_QUERY,
    EXPORT_SAVED,
} from '../actions/submit'

const initialState = {
    currentQuery: 0,
    finished: [...Array(10)].map((i) => false)
};

export default function (state = initialState, action) {
    if (action.type === NEXT_QUERY) {
        if (state.finished.includes(false)) {
            var newQuery += state.currentQuery + 1
                while (newQuery < state.finished.length && state.finished[newQuery]) {
                    newQuery += 1
                    if (newQuery == finished.length) {
                        newQuery = 0
                    }
                }
                return {
                            ...state,
                            currentQuery: newQuery
                        }
        }
    }
    else if (action.type === EXPORT_SAVED) {
        return {
            ...state,
            finished: [...finished.slice(0, state.currentQuery), true, ...finished.slice(state.currentQuery + 1)]
        }
    }
}
