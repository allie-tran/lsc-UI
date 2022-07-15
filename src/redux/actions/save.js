export const SAVE_SCENE = 'SAVE_SCENE';
export const REMOVE_SCENE = 'REMOVE_SCENE'
export const EXPORT = 'EXPORT'
export const SET_SAVED = 'SET_SAVED';
export const CLEAR_SAVED = 'CLEAR_SAVED';

export function saveScene(scene) {
    return {
        type: SAVE_SCENE,
        scene: scene
    }
}

export function setSaved(saved) {
    return {
        type: SET_SAVED,
        saved: saved
    }
}

export function removeScene(sceneId) {
    return {
        type: REMOVE_SCENE,
        sceneId: sceneId
    }
}

export function exportSave(sceneId, time) {
    return {
        type: EXPORT,
        sceneId: sceneId,
        time: time
    }
}

export function clearSaved() {
    return {
        type: CLEAR_SAVED
    };
}
