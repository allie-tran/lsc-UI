import {
    SAVE_SCENE,
    REMOVE_SCENE
} from '../actions/save'

const initialState = {
    saved: []
};
export default function (state = initialState, action) {
    if (action.type === SAVE_SCENE) {
        return {
            ...state,
            saved: [...state.saved, action.scene]
        }
    }
    else if (action.type === REMOVE_SCENE) {
        return {
            ...state,
            saved: [...state.saved.slice(0, action.sceneId),
            ...state.saved.slice(action.sceneId + 1)]
        }
    }
    return state
}
