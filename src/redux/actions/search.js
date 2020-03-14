export const GET_ALL_IMAGES = 'GET_ALL_IMAGES';

export function getImages(query = {}) {
    return { type: GET_ALL_IMAGES, query}
}