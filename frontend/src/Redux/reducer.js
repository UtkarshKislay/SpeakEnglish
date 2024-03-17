import { SAVE_USER_INFO, SAVE_USER_TRANSCRIPT } from "./Constant"

const initialState = {
    data: {}
};
export const userInfo = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_USER_INFO:
            return {
                ...state,
                data: action.payload
            };
        default:
            return state;

    }
}

export const userTranscript = (state = [], action) => {
    switch (action.type) {
        case SAVE_USER_TRANSCRIPT:
            return {
                data: action.payload
            };
        default:
            return state
    }
}