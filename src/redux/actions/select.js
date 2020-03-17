export const SELECT_SCENE = 'SELECT_SCENE';

export function sendToMap(index = null) {
    return { type: SELECT_SCENE, index }
}
