import {
    SAVE_SCENE,
    REMOVE_SCENE,
    EXPORT,
    SET_SAVED
} from '../actions/save'
import axios from 'axios';

export const saveState = {
    saved: [],
    currentQuery: 1,
	finished: [ ...Array(10) ].map((i) => false),
    timerRunning: false,
    saveResponse: null,
};
export default function (state = saveState, action) {
    if (action.type === SAVE_SCENE) {
        if (!state.finished[state.currentQuery - 1]){
            axios.post('http://localhost:7999/api/save?image_id=' + action.scene[0] + '&query_id=' + state.currentQuery)
        }
        return {
            ...state,
            saved: [...state.saved, action.scene]
        }
    }
    else if (action.type === REMOVE_SCENE) {
        if (!state.finished[state.currentQuery - 1]){
            axios.post('http://localhost:7999/api/remove?image_id=' + state.saved[action.sceneId][0] + '&query_id=' + state.currentQuery)
        }
        return {
            ...state,
            saved: [...state.saved.slice(0, action.sceneId),
            ...state.saved.slice(action.sceneId + 1)]
        }
    }
    else if (action.type === EXPORT) {
        axios.post('http://localhost:7999/api/submit/')
    }
    else if (action.type === SET_SAVED) {
        return {
            ...state,
            saved: action.saved
        }
    }
    return state
}
