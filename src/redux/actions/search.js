export const GET_ALL_IMAGES = 'GET_ALL_IMAGES';
export const SET_MAP = 'SET_MAP';
export const NEXT_SCENE = 'NEXT_SCENE';
export const GET_GROUP = 'GET_GROUP';
export const CLEAR_NEXT_SCENE = 'CLEAR_NEXT_SCENE';
export const SET_BOUND = 'SET_BOUND';
export const SET_INFO = 'SET_INFO';
export const SET_KEYWORDS = 'SET_KEYWORDS';
export const SIMILAR = 'SIMILAR'
export const GET_GPS = 'GET_GPS'
export const GET_INFO = 'GET_INFO'
export const SET_MUST_NOT = 'SET_MUST_NOT';
export const REMOVE_MUST_NOT = 'REMOVE_MUST_NOT'
export const SET_FINISH_SEARCH = 'SET_FINISH_SEARCH'
export const MORE = 'MORE'
export const MORE_SCENES = "MORE_SCENES";


export function getImages(query = {}, ignoreInfo = false, starting_from = 0, share_info=false) {
    return { type: GET_ALL_IMAGES, query, ignoreInfo, starting_from, share_info };
}
export function More() {
    return { type: MORE };
}

export function setFinishedSearch(finishedSearch) {
	return { type: SET_FINISH_SEARCH, finishedSearch };
}

export function setMap(dates = []) {
	return { type: SET_MAP, dates };
}

export function getNextScenes(images = [],  direction='next') {
	return { type: NEXT_SCENE, images, direction };
}

export function getMoreScenes(group, direction) {
    return { type: MORE_SCENES, group, direction };
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

export function getGPS(image) {
	return {
		type: GET_GPS,
		image
	};
}

export function getInfo(image) {
    return {
        type: GET_INFO,
        image: image
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

export function setMustNot(keyword) {
    return {
        type: SET_MUST_NOT,
        keyword
    }
}

export function removeMustNot(keyword) {
    return {
        type: REMOVE_MUST_NOT,
        keyword
    }
}

export function getSimilar(image) {
	return { type: SIMILAR, image };
}
