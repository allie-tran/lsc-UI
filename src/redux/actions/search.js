export const GET_ALL_IMAGES = 'GET_ALL_IMAGES';
export const SET_SCENE = 'SET_SCENE';

export function getImages(query = {}) {
    return { type: GET_ALL_IMAGES, query }
}

export function setScene(scenes = []) {
    return { type: SET_SCENE, scenes }
}