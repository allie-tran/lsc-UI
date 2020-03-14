import { GET_ALL_IMAGES, SET_SCENE } from '../actions/search'
import axios from 'axios'

const initialState = {
    collection: new Promise((resolve, reject) => {
        resolve({ "data": { "results": [] } })
    }),
    scenes: []
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
    return state
}