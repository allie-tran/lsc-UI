
export const LOGIN = "LOGIN";
export const NEXT_QUERY = 'NEXT_QUERY';
export const EXPORT_SAVED = 'EXPORT_SAVED';
export const START_TIMER = 'START_TIMER'
export const PAUSE_TIMER = 'PAUSE_TIMER'
export const DISABLE = 'DISABLE'
export const SET_TIMER = 'SET_TIMER'
export const SUBMIT_IMAGE = 'SUBMIT_IMAGE'
export const SUBMIT_ALL = "SUBMIT_ALL";
export const SET_SESSION_NAME = 'SET_SESSION_NAME'

export function login() {
    return {type: LOGIN}
}

export function nextQuery(time) {
    return { type: NEXT_QUERY, time }
}

export function exportSaved(saved) {
    return { type: EXPORT_SAVED, saved }
}

export function startTimer() {
    return {type: START_TIMER}
}

export function pauseTimer() {
    return {type: PAUSE_TIMER}
}

export function disable() {
    return {type: DISABLE}
}

export function setTimer(time) {
    return {type: SET_TIMER, time}
}

export function submitImage(image, scene) {
    return {type: SUBMIT_IMAGE, image, scene}
}

export function submitAll(saved) {
    return { type: SUBMIT_ALL, saved };
}


export function setSessionName(sessionName) {
    return { type: SET_SESSION_NAME, sessionName }
}
