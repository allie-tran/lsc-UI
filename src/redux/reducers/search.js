import { GET_ALL_IMAGES, SET_SCENE, NEXT_SCENE, CLEAR_NEXT_SCENE} from '../actions/search'
import axios from 'axios'

const initialState = {
    collection: new Promise((resolve, reject) => {
        resolve({ "data": { "results": [] } })
    }),
    scenes: [],
    nextSceneRespone: new Promise((resolve, reject) => {
        resolve({ "data": { "timeline": [] } })
    })
};

export default function (state = initialState, action) {
    if (action.type === GET_ALL_IMAGES) {
        const response = axios.post(
            'http://localhost:8000/api/image/',
            { "query": action.query },
            { headers: { 'Content-Type': 'application/json' } });
        return {
            ...state,
            collection: response
        }
    }
    else if (action.type === SET_SCENE) {
        return {
            ...state,
            scenes: action.scenes
        }
    }
    else if (action.type === NEXT_SCENE) {
        const response = axios.post(
            'http://localhost:8000/api/timeline/',
            { "images": action.images,
              "timeline_type": action.timeline_type },
            { headers: { 'Content-Type': 'application/json' } });
        return {
            ...state,
            nextSceneRespone: response
        }
    }
    else if (action.type === CLEAR_NEXT_SCENE) {
        return {
            ...state,
            nextSceneRespone: new Promise((resolve, reject) => {
                              resolve({ "data": { "timeline": [] } })})
        }
    }
    return state
}
