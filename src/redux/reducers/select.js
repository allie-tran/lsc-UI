import {
    SELECT_SCENE,
    SELECT_MARKERS,
    RESET
} from '../actions/select'

export const selectState = {
    selected: null,
    markersSelected: [],
    currentMarker: -1,
    visualise: []
};
var isEqual = require('lodash.isequal');

export default function (state = selectState, action) {
    if (action.type === SELECT_SCENE) {
        return {
            ...state,
            selected: action.index
        }
    }
    else if (action.type === SELECT_MARKERS) {
        action.indices.sort((a, b) => a - b)

        if (isEqual(state.markersSelected, action.indices)){
            if (state.currentMarker === action.indices.length - 1) {
                return {
                    ...state,
                    currentMarker: 0,
                }
            }
            return {
                ...state,
                currentMarker: state.currentMarker + 1,
            }
        }
        return {
            ...state,
            markersSelected: action.indices,
            currentMarker: action.indices.length > 0? 0: -1,
        }
    }
    else if (action.type === RESET) {
        return {
            ...selectState
        }
    }
    return state
}
