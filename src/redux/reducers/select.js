import {
    SELECT_SCENE,
    SELECT_MARKERS
} from '../actions/select'

const initialState = {
    selected: null,
    markersSelected: []
};

export default function (state = initialState, action) {
    if (action.type === SELECT_SCENE) {
        return {
            ...state,
            selected: action.index
        }
    }
    else if (action.type === SELECT_MARKERS) {
        return {
            ...state,
            markersSelected: action.indices
        }
    }
    return state
}
