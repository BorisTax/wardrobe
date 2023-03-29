import { ModelActions } from "../actions/ModelActions";

export const FasadBase = {
    DSP: "DSP",
    MIRROR: "MIRROR",
    SAND: "SAND",
    LACOBEL: "LACOBEL"
}


export const getFasadBases = () => [FasadBase.DSP, FasadBase.MIRROR, FasadBase.SAND, FasadBase.LACOBEL]

export default function materialReducer(state, action){
    switch (action.type){
        case ModelActions.SET_MATERIAL:
            return { result: true, newState: {...state, materials: {...state.materials, ...action.payload}} };

        case ModelActions.SET_LOADED_MATERIALS:
            return { result: true, newState: {...state, materials: {...state.materials, ...action.payload}} };

        default: {
            return {result: false, newState: state}
        }
    }
}