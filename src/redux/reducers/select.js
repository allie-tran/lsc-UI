import {
    SELECT_SCENE,
    SELECT_MARKERS,
    RESET
} from '../actions/select'

const initialState = {
    selected: null,
    markersSelected: [],
    currentMarker: -1
};

export default function (state = initialState, action) {
    if (action.type === SELECT_SCENE) {
        return {
            ...state,
            selected: action.index
        }
    }
    else if (action.type === SELECT_MARKERS) {
        console.log(action.indices)
        console.log(state.markersSelected)
        if (action.indices.length === state.markersSelected.length && action.indices.every(function(value, index) { return value === state.markersSelected[index]})){
            if (state.currentMarker === action.indices.length - 1) {
                return {
                    ...state,
                    currentMarker: 0,
                    selected: action.indices[0]
                }
            }
            return {
                ...state,
                currentMarker: state.currentMarker + 1,
                selected: action.indices[state.currentMarker + 1]
            }
        }
        return {
            ...state,
            markersSelected: action.indices,
            currentMarker: action.indices.length > 0? 0: -1,
            selected: action.indices.length > 0? action.indices[0]: null
        }
    }
    else if (action.type === RESET) {
        return {
            ...initialState
        }
    }
    return state
}
