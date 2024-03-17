import { SAVE_USER_INFO, SAVE_USER_TRANSCRIPT } from "./Constant";

export const saveUserInfo=(user)=>{
    return {
        type:SAVE_USER_INFO,
        payload: user
    }
}

export const saveUserTranscript=(transcript)=>{
     return {
        type:SAVE_USER_TRANSCRIPT,
        payload:transcript
     }
}