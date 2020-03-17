import {
    SELECT_SCENE
} from '../actions/select'

const initialState = {
    selected: null
};

export default function (state = initialState, action) {
    if (action.type === SELECT_SCENE) {
        return {
            ...state,
            selected: action.index
        }
    }
    return state
}
