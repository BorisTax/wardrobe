import { ModelActions } from "../actions/ModelActions";
import { setMaterial } from "./functions";

export default function detailReducer(state, action){
    switch (action.type){
        case ModelActions.ADD_DETAIL:
            state.detailList = { ...state.detailList }
            let newId = 1
            // eslint-disable-next-line
            while (state.detailList[action.payload.listKey].some(detail => detail.id === newId)) newId++;
            state.detailList[action.payload.listKey].push({ id: newId, listKey: action.payload.listKey, name: "", length: 717, width: 297, count: 1, placed: 0, created: 0, margin: state.panelMargin / 2 });
            return { result: true, newState: {...state} };


        case ModelActions.SET_DETAIL_LIST:
            if (action.payload.data.error) return { ...state, showAlert: { show: true, message: "corruptedDetailList" } }
            const info = action.payload.data.info
            const list = action.payload.data.list
            const listKey = action.payload.listKey
            const newState = setMaterial(state, info.material);
            newState.detailList[listKey] = list.map(i => { return { listKey: listKey, margin: newState.panelMargin / 2, ...i } })
            const dList = { primary: newState.detailList["primary"], secondary: newState.detailList["secondary"] }
            newState.detailList = dList
            newState.information.order = info.order;
            newState.information.plan = info.plan;
            newState.material = info.material;
            newState.panels = [];
            return {result: true, newState};



        default: {
            return {result: false, newState: state}
        }
    }
}