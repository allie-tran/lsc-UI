export const SELECT_SCENE = 'SELECT_SCENE';
export const SELECT_MARKERS = 'SELECT_MARKERS';
export const RESET = 'RESET'
export function sendToMap(index = null) {
    return { type: SELECT_SCENE, index }
}

export function selectMarkers(indices = null) {
    return { type: SELECT_MARKERS, indices }
}

export function resetSelection() {
    return { type: RESET }
}
