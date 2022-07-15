import { SUBMIT_IMAGE, LOGIN, SUBMIT_ALL } from "../actions/submit";
import axios from "axios";

export const submitState = {
    submitResponse: null
};

export default function (state = submitState, action) {
    if (action.type === SUBMIT_IMAGE) {
        const response = axios.get(
            "http://localhost:7999/api/submit?image_id=" +
                action.image +
                "&scene=" +
                action.scene
        );
        return {
            ...state,
            submitResponse: response
        }
    } else if (action.type === LOGIN) {
        const response = axios.get(
            "http://localhost:7999/api/login"
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
            "http://localhost:7999/api/submit_saved/",
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
