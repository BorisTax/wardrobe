import { ScreenActions } from "../actions/ScreenActions";
import { ShapeActions } from "../actions/ShapeActions";
import DragCursor from "../components/shapes/cursors/DragCursor";
import SelectCursor from "../components/shapes/cursors/SelectCursor";
import PanelShape from "../components/shapes/PanelShape"
import { PanelCreateHandler } from "../handlers/PanelCreateHandler";
import { PanelPlaceHandler } from "../handlers/PanelPlaceHandler";
import { StatusFreeHandler } from "../handlers/StatusFreeHandler";
import { Status } from "./functions";

export default function panelReducer(state, action){
    switch (action.type){
        case ScreenActions.ADD_PANEL:
            const panel = action.payload
            state.panels.push(panel);
            return { result: true, newState: {...state, status: Status.FREE} };

        case ShapeActions.CREATE_PANEL:
            state.panels.forEach(p => { p.state.selected = false })
            var newState = {
                ...state, curShape: new PanelShape({ ...action.payload, hidden: true}),
                cursor: new DragCursor(state.curRealPoint), status: Status.CREATE
            }
            return { result: true, newState: {...newState, mouseHandler: new PanelCreateHandler(newState, true)} };

        case ScreenActions.DELETE_CONFIRM:
            const showConfirm = (state.panels.some(s => s.state.selected)) ? { show: true, messageKey: "deletePanels", actions: [{ caption: "OK", onClick: ScreenActions.deleteSelectedPanels }] } : {show: false}
            return { result: true, newState: {...state, showConfirm}}

        case ScreenActions.DELETE_SELECTED_PANELS:
            const panels = state.panels.filter((p) => {
                if (p.state.selected) state.detailList[p.model.listKey].forEach(d => { if (p.getId() === d.id) d.created--; })
                return !p.getState().selected;
            });
            newState = {
                ...state,
                panels,
                selectedPanels: [],
                mouseHandler: new StatusFreeHandler(state),
                cursor: new SelectCursor()
            };
            return { result: true, newState: {...newState, detailList: { ...newState.detailList }} };

        case ShapeActions.MOVE_PANEL:
            newState = {
                ...state, curShape: action.payload.panel,
                cursor: new DragCursor(state.curRealPoint),
            }
            return {result: true, 
                newState: {...newState,
                mouseHandler: new PanelPlaceHandler(newState, false, action.payload.movePoint)}
            };

           
        case ScreenActions.SELECT_PANEL:
            return { result: true, newState: {...state, selectedPanels: action.payload} };

        default: {
            return {result: false, newState: state}
        }
    }
}