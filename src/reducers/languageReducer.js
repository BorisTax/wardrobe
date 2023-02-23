import { AppActions } from "../actions/AppActions";

export default function languageReducer(state, action){
    switch (action.type){
        case AppActions.SET_LANGUAGE:
            document.title = action.payload.title;

            state.mouseHandler.setCaptions(action.payload.toolbars.statusbar)
            return { result: true, newState: {...state, captions: action.payload} };

        default: {
            return {result: false, newState: state}
        }
    }
}