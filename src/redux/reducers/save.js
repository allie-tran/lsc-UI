import {
    SAVE_SCENE,
    REMOVE_SCENE
} from '../actions/save'

export const saveState = {
    saved: [],
    currentQuery: 1,
	finished: [ ...Array(5) ].map((i) => false),
};
export default function (state = saveState, action) {
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
