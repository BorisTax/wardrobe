import { ModelActions } from "../actions/ModelActions";

export default function materialReducer(state, action){
    switch (action.type){
        case ModelActions.SET_MATERIAL:
            return { result: true, newState: {...state, materials: {...state.materials, ...action.payload}} };

        default: {
            return {result: false, newState: state}
        }
    }
}