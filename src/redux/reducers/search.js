import {
	GET_ALL_IMAGES,
	SET_MAP,
	NEXT_SCENE,
	CLEAR_NEXT_SCENE,
	SET_BOUND,
	SET_INFO,
	SET_KEYWORDS,
    SIMILAR,
    GET_GROUP,
    GET_GPS
} from '../actions/search';
import axios from 'axios';

export const searchState = {
	collection: null,
	dates: [],
	nextSceneRespone: null,
	bounds: null,
	info: null,
	keywords: [],
    similarResponse: null,
    groupResponse: null,
    gpsResponse: null,
};

var isEqual = require('lodash.isequal');

export default function(state = searchState, action) {
	if (action.type === SET_BOUND) {
		return {
			...state,
			bounds: action.bounds
		};
	} else if (action.type === GET_ALL_IMAGES) {
		if (!action.ignoreInfo && state.keywords.length > 0) {
			var newInfo = JSON.parse(JSON.stringify(state.info));
			newInfo.expansion_score = {};
			state.keywords.forEach((keyword) => {
				newInfo.expansion_score[keyword[0]] = keyword[1];
			});
			const response = axios.post(
				'http://localhost:7999/api/date/',
				{
					query: {
						before: '',
						after: '',
						current: '',
						info: newInfo
					},
					gps_bounds: state.bounds
				},
				{ headers: { 'Content-Type': 'application/json' } }
			);
			return {
				...state,
				collection: response
			};
		} else {
			const response = axios.post(
				'http://localhost:7999/api/date/',
				{ query: action.query, gps_bounds: state.bounds },
				{ headers: { 'Content-Type': 'application/json' } }
			);
			return {
				...state,
				collection: response
			};
		}
	} else if (action.type === SET_MAP) {
		if (!isEqual(state.dates, action.dates)) {
			return {
				...state,
				dates: action.dates
			};
		}
	} else if (action.type === NEXT_SCENE) {
		const response = axios.post(
			'http://localhost:7999/api/timeline/',
			{
				images: action.images,
				timeline_type: action.timeline_type,
                direction: action.direction
			},
			{ headers: { 'Content-Type': 'application/json' } }
		);
		return {
			...state,
			nextSceneRespone: response
		};
	} else if (action.type === CLEAR_NEXT_SCENE) {
		return {
			...state,
			nextSceneRespone: null,
            similarResponse: null
		};
    } else if (action.type === GET_GROUP){
        const response = axios.post(
			'http://localhost:7999/api/timeline/group/',
			{
				date: action.date
			},
			{ headers: { 'Content-Type': 'application/json' } }
		);
        return {
			...state,
			groupResponse: response
		};
    } else if (action.type === GET_GPS){
        const response = axios.post(
			'http://localhost:7999/api/gps/',
			{
				image: action.image
			},
			{ headers: { 'Content-Type': 'application/json' } }
		);
        return {
			...state,
			gpsResponse: response
		};
    }
    else if (action.type === SET_INFO) {
		if (!isEqual(state.info, action.info)) {
			return {
				...state,
				info: action.info
			};
		}
	} else if (action.type === SET_KEYWORDS) {
		if (!isEqual(state.keywords, action.keywords)) {
			return {
				...state,
				keywords: action.keywords
			};
		}
	} else if (action.type === SIMILAR) {
        const response = axios.post(
                'http://localhost:7999/similar/group?image_id=' + action.image)
		return {
			...state,
			similarResponse: response
		}
	}
	return state;
}
