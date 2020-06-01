export const GET_ALL_IMAGES = 'GET_ALL_IMAGES';
export const SET_MAP = 'SET_MAP';
export const NEXT_SCENE = 'NEXT_SCENE';
export const GET_GROUP = 'GET_GROUP';
export const CLEAR_NEXT_SCENE = 'CLEAR_NEXT_SCENE';
export const SET_BOUND = 'SET_BOUND';
export const SET_INFO = 'SET_INFO';
export const SET_KEYWORDS = 'SET_KEYWORDS';
export const SIMILAR = 'SIMILAR'

export function getImages(query = {}, ignoreInfo=false) {
	return { type: GET_ALL_IMAGES, query, ignoreInfo };
}

export function setMap(dates = []) {
	return { type: SET_MAP, dates };
}

export function getNextScenes(images = [], timeline_type = 'after', direction='next') {
	return { type: NEXT_SCENE, images, timeline_type, direction };
}

export function getGroups(date) {
	return { type: GET_GROUP, date};
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

export function getSimilar(image) {
	return { type: SIMILAR, image };
}
