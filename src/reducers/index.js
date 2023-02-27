import { StatusFreeHandler } from "../handlers/StatusFreeHandler";
import { getInitialState } from "./initialState";
import statusReducer from "./statusReducer";
import panelReducer from "./panelReducer";
import detailReducer from "./detailReducer";
import projectReducer from "./projectReducer";
import dialogsReducer from "./dialogsReducer";
import materialReducer from "./materialReducer";
import optionReducer from "./optionReducer";
import languageReducer from "./languageReducer";
import { userReducer } from "./userReducer";

const initialState = getInitialState({})
initialState.mouseHandler = new StatusFreeHandler(initialState)
export const rootReducer = (state = initialState, action) => {
    let newState = { ...state }
    let result;
    ({result, newState} = statusReducer(state, action))
    if(result) return newState;
    ({result, newState} = panelReducer(state, action))
    if(result) return newState;
    ({result, newState} = detailReducer(state, action))
    if(result) return newState;
    ({result, newState} = projectReducer(state, action))
    if(result) return newState;
    ({result, newState} = dialogsReducer(state, action))
    if(result) return newState;
    ({result, newState} = materialReducer(state, action))
    if(result) return newState;
    ({result, newState} = optionReducer(state, action))
    if(result) return newState;
    ({result, newState} = languageReducer(state, action))
    if(result) return newState;
    ({result, newState} = userReducer(state, action))
    if(result) return newState
    return state;
}