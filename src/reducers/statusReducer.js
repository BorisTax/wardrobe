import { ModelActions } from "../actions/ModelActions";
import { ScreenActions } from "../actions/ScreenActions";
import DragCursor from "../components/shapes/cursors/DragCursor";
import SelectCursor from "../components/shapes/cursors/SelectCursor";
import { FasadeFreeHandler } from "../handlers/FasadeFreeHandler";
import { PanelFreeHandler } from "../handlers/PanelFreeHandler";
import { StatusPanHandler } from "../handlers/StatusPanHandler";
import { Status } from "./functions";
import { WORKSPACE } from "./initialState";
import { SelectionSet } from "./panels";

export default function statusReducer(state, action) {
    switch (action.type) {
        case ScreenActions.ABORT:
            return {
                result: true,
                newState: {
                    ...state, status: Status.FREE, curShape: null, cursor: new SelectCursor(state.curRealPoint),
                    mouseHandler: state.workspace === WORKSPACE.CORPUS ? new PanelFreeHandler(state) : new FasadeFreeHandler(state),
                }
            }

        case ScreenActions.CANCEL:
            state.panels.forEach(s => {
                s.setState({ selected: false, underCursor: false, highlighted: false, inSelection: false });
            })
            state.dimensions.forEach(s => s.setState({ selected: false, underCursor: false, highlighted: false, inSelection: false }))
            const newState = {
                ...state,
                status: Status.FREE,
                curShape: null,
                cursor: new SelectCursor(state.curRealPoint),
                mouseHandler: state.workspace === WORKSPACE.CORPUS ? new PanelFreeHandler(state) : new FasadeFreeHandler(state),
                toolButtonsPressed: {
                    createVertical: false,
                    createHorizontal: false,
                    createSingleDimension: false,
                }
            }
            return { result: true, newState };

        case ScreenActions.CANCEL_MOVING:
            return {
                result: true,
                newState: {
                    ...state,
                    status: Status.FREE, curShape: null, cursor: new SelectCursor(state.curRealPoint),
                    mouseHandler: state.workspace === WORKSPACE.CORPUS ? new PanelFreeHandler(state) : new FasadeFreeHandler(state),
                }
            }

        case ScreenActions.CANCEL_SELECTION:
            state.panels.forEach(s => s.setState({ selected: false, underCursor: false, highlighted: false, inSelection: false }))
            state.dimensions.forEach(s => s.setState({ selected: false, underCursor: false, highlighted: false, inSelection: false }))
            state.selectedPanels.clear()
            return {
                result: true,
                newState: {
                    ...state,
                    status: Status.FREE,
                    curShape: null,
                    cursor: new SelectCursor(state.curRealPoint)
                }
            }

        case ScreenActions.PAN_SCREEN:
            return {
                result: true,
                newState: {
                    ...state,
                    prevStatus: action.payload.prevStatus,
                    status: Status.PAN,
                    prevCursor: state.cursor,
                    prevMouseHandler: action.payload.prevMouseHandler,//state.mouseHandler,
                    cursor: new DragCursor(action.payload),
                    mouseHandler: new StatusPanHandler({ ...action.payload, state })
                }
            }

        case ScreenActions.REPAINT:
            return { result: true, newState: { ...state } }

        case ScreenActions.RESET_VIEW:
            return { result: true, newState: { ...state, resetView: !state.resetView } }

        case ScreenActions.SET_CURSOR:
            return { result: true, newState: { ...state, cursor: action.payload } }

        case ScreenActions.SET_PREV_STATUS:
            return {
                result: true,
                newState: {
                    ...state,
                    status: state.prevStatus,
                    cursor: state.prevCursor,
                    mouseHandler: state.prevMouseHandler
                }
            }
        case ScreenActions.SET_STATUS:
            return {
                result: true,
                newState: {
                    ...state,
                    status: action.payload.status,
                    prevStatus: action.payload.prevStatus,
                    statusParams: action.payload.params
                }
            };

        case ScreenActions.START_SELECTION:
            return {
                result: true,
                newState: {
                    ...state,
                    cursor: new SelectCursor(state.curRealPoint),
                    status: Status.SELECT,
                    mouseHandler: new action.payload.handler(action.payload.point, state)
                }
            }

        case ScreenActions.STOP_SELECTION:
            if (!action.payload.isSelectedPanels) state.selectedPanels.clear()
            return {
                result: true, newState: {
                    ...state,
                    status: Status.FREE,
                    cursor: new SelectCursor(state.curRealPoint),
                    mouseHandler: new action.payload.handler(state),
                }
            };

        case ModelActions.UPDATE_STATE:
            //const selectedPanels.clear()
            //state.panels.forEach(p => {if(p.state.selected) selectedPanels.add(p)})
            return { result: true, newState: { ...state } }

        default: {
            return { result: false, newState: state }
        }
    }
}