import { combineReducers } from "redux";
import { userInfo,userTranscript } from "./reducer";

const rootReducer=combineReducers({userInfo,userTranscript});

export default rootReducer;