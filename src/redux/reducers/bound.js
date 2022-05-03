import {
    SET_BOUND
} from '../actions/bound'

const initialState = {
    bounds: null
};

export default function (state = initialState, action) {
    if (action.type === SET_BOUND) {
        return {
            ...state,
            bounds: action.bounds
        }
    }
    return state
}
