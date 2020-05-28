import {
	GET_ALL_IMAGES,
	SET_SCENE,
	NEXT_SCENE,
	CLEAR_NEXT_SCENE,
	SET_BOUND,
	SET_INFO,
	SET_KEYWORDS
} from '../actions/search';
import axios from 'axios';

const initialState = {
	collection: new Promise((resolve, reject) => {
		resolve({ data: { results: [] } });
	}),
	scenes: [],
	nextSceneRespone: new Promise((resolve, reject) => {
		resolve({ data: { timeline: [] } });
	}),
	bounds: null,
	info: null,
	keywords: []
};

export default function(state = initialState, action) {
	if (action.type === SET_BOUND) {
		return {
			...state,
			bounds: action.bounds
		};
	} else if (action.type === GET_ALL_IMAGES) {
		if (state.keywords.length > 0) {
			var newInfo = JSON.parse(JSON.stringify(state.info));
			newInfo.expansion_score = {};
			state.keywords.forEach((keyword) => {
				newInfo.expansion_score[keyword[0]] = keyword[1];
			});
			const response = axios.post(
				'http://localhost:7999/api/image/',
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
				'http://localhost:7999/api/image/',
				{ query: action.query, gps_bounds: state.bounds },
				{ headers: { 'Content-Type': 'application/json' } }
			);
			return {
				...state,
				collection: response
			};
		}
	} else if (action.type === SET_SCENE) {
		var isEqual = require('lodash.isequal');
		if (!isEqual(state.scenes, action.scenes)) {
			return {
				...state,
				scenes: action.scenes
			};
		}
	} else if (action.type === NEXT_SCENE) {
		const response = axios.post(
			'http://localhost:7999/api/timeline/',
			{
				images: action.images,
				timeline_type: action.timeline_type
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
			nextSceneRespone: new Promise((resolve, reject) => {
				resolve({ data: { timeline: [] } });
			})
		};
	} else if (action.type === SET_INFO) {
		var isEqual = require('lodash.isequal');
		if (!isEqual(state.info, action.info)) {
			return {
				...state,
				info: action.info
			};
		}
	} else if (action.type === SET_KEYWORDS) {
		var isEqual = require('lodash.isequal');
		if (!isEqual(state.keywords, action.keywords)) {
			return {
				...state,
				keywords: action.keywords
			};
		}
	}
	return state;
}
