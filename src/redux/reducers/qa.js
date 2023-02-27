import {
    SET_TEXT_ANSWER,
    ANSWER_FOR_SCENE
} from "../actions/qa";
import axios from "axios";
import configData from "../../config.json";

export const qaState = {
  texts: ["example 1", "example 2"],
  answerSceneResponse: null,
};
export default function(state = qaState, action) {
	if (action.type === SET_TEXT_ANSWER) {
        return {
        ...state,
        texts: action.texts
        }
    }
    else if (action.type === ANSWER_FOR_SCENE) {
        const response = axios.post(
            configData.BACKEND_URL + 'answer_scene/',
            {
                images:action.images,
                question:action.question
            },
            { headers: { 'Content-Type': 'application/json' } }
        );
        return {
            ...state,
            answerSceneResponse: response
        }
    };
  return state;
}
