import { SUBMIT_IMAGE, LOGIN, SUBMIT_ALL } from "../actions/submit";
import axios from "axios";
import configData from "../../config.json";

export const submitState = {
    submitResponse: null
};

export default function (state = submitState, action) {
    if (action.type === SUBMIT_IMAGE) {
        const response = axios.get(
            configData.BACKEND_URL + "submit?image_id=" +
                action.image +
                "&scene=" +
                action.scene +
                "&qa_answer=" +
                action.qa_answer
        );
        return {
            ...state,
            submitResponse: response
        }
    } else if (action.type === LOGIN) {
        const response = axios.get(
            configData.BACKEND_URL + "login?session_id=" + action.sessionID
        );
        return {
            ...state,
            submitResponse: response
        }
        // response.then((res) => {
        //     alert(res.data.sessionId);
        // });
    } else if (action.type === SUBMIT_ALL) {
        const response = axios.post(
            configData.BACKEND_URL + "submit_saved/",
            {
                saved: action.saved,
            },
            { headers: { "Content-Type": "application/json" } }
        );
        return {
            ...state,
            submitResponse: response
        }
    }
    return state;
}
