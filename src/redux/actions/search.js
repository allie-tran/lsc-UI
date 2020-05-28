export const GET_ALL_IMAGES = 'GET_ALL_IMAGES';
export const SET_SCENE = 'SET_SCENE';
export const NEXT_SCENE = 'NEXT_SCENE';
export const CLEAR_NEXT_SCENE = 'CLEAR_NEXT_SCENE';
export const SET_BOUND = 'SET_BOUND';
export const SET_INFO = 'SET_INFO';
export const SET_KEYWORDS = 'SET_KEYWORDS';

export function getImages(query = {}) {
	return { type: GET_ALL_IMAGES, query };
}

export function setScene(scenes = []) {
	return { type: SET_SCENE, scenes };
}

export function getNextScenes(images = [], timeline_type = 'after') {
	return { type: NEXT_SCENE, images, timeline_type };
}

export function clearNextEvents() {
	return { type: CLEAR_NEXT_SCENE };
}

export function setQueryBound(bounds) {
	return {
		type: SET_BOUND,
		bounds
	};
}

export function setQueryInfo(info) {
	return {
		type: SET_INFO,
		info
	};
}

export function setKeywords(keywords) {
	return {
		type: SET_KEYWORDS,
		keywords
	};
}
