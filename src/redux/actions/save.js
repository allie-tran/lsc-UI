export const SAVE_SCENE = 'SAVE_SCENE';
export const REMOVE_SCENE = 'REMOVE_SCENE'

export function saveScene(scene) {
    return {
        type: SAVE_SCENE,
        scene: scene
    }
}

export function removeScene(sceneId) {
    return {
        type: REMOVE_SCENE,
        sceneId: sceneId
    }
}