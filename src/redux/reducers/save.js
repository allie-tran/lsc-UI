import {
    SAVE_SCENE,
    REMOVE_SCENE,
    EXPORT,
    SET_SAVED,
    CLEAR_SAVED,
} from "../actions/save";
import axios from 'axios';

export const saveState = {
	saved: [],
	currentQuery: 1,
	finished: [ ...Array(10) ].map((i) => 300),
	timerRunning: false,
	saveResponse: null,
    time: 300,
    sessionName: 'Default'
};
export default function(state = saveState, action) {
	if (action.type === SAVE_SCENE) {
        return {
            ...state,
            saved: [...state.saved, action.scene],
        };
    } else if (action.type === REMOVE_SCENE) {
        return {
            ...state,
            saved: [
                ...state.saved.slice(0, action.sceneId),
                ...state.saved.slice(action.sceneId + 1),
            ],
        };
    } else if (action.type === EXPORT) {
        axios.post("http://localhost:7999/api/submit/");
    } else if (action.type === SET_SAVED) {
        return {
            ...state,
            saved: action.saved,
        };
    } else if (action.type === CLEAR_SAVED) {
        return {
            ...state,
            saved: []
        };
    }
	return state;
}
