import { SAVE_SCENE, REMOVE_SCENE, EXPORT, SET_SAVED } from '../actions/save';
import axios from 'axios';

<<<<<<< HEAD
export const saveState = {
	saved: [],
	currentQuery: 1,
	finished: [ ...Array(10) ].map((i) => 300),
	timerRunning: false,
	saveResponse: null,
    time: 300
};
export default function(state = saveState, action) {
	if (action.type === SAVE_SCENE) {
		if (state.time >= 0) {
			axios.post(
				'http://localhost:7999/api/save?image_id=' + action.scene[0] + '&query_id=' + state.currentQuery + '&time=' + state.time
			);
			return {
				...state,
				saved: [ ...state.saved, action.scene ]
			};
		}
	} else if (action.type === REMOVE_SCENE) {
		if (state.time) {
			axios.post(
				'http://localhost:7999/api/remove?image_id=' +
					state.saved[action.sceneId][0] +
					'&query_id=' +
					state.currentQuery + '&time=' + state.time
			);
			return {
				...state,
				saved: [ ...state.saved.slice(0, action.sceneId), ...state.saved.slice(action.sceneId + 1) ]
			};
		}
	} else if (action.type === EXPORT) {
		axios.post('http://localhost:7999/api/submit/');
	} else if (action.type === SET_SAVED) {
		return {
			...state,
			saved: action.saved
		};
	}
	return state;
=======
const initialState = {
    saved: [['Thumbnail1', 'img1', 'img2'],
    ['Thumbnail2', 'img1', 'img2'],
    ['Thumbnail3', 'img1', 'img2'],
    ['Thumbnail4', 'img1', 'img2'],
    ['Thumbnail5', 'img1', 'img2']]
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
>>>>>>> cc4db94... Move to thumbnails, remove react-window, use flexbox, transition ok
}
