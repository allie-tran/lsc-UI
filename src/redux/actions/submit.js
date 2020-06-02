
export const NEXT_QUERY = 'NEXT_QUERY';
export const EXPORT_SAVED = 'EXPORT_SAVED';
export const START_TIMER = 'START_TIMER'
export const PAUSE_TIMER = 'PAUSE_TIMER'
export const DISABLE = 'DISABLE'

export function nextQuery() {
    return { type: NEXT_QUERY }
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
