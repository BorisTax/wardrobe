import { ModelActions } from "../actions/ModelActions";
import { ScreenActions } from "../actions/ScreenActions";
import DragCursor from "../components/shapes/cursors/DragCursor";
import SelectCursor from "../components/shapes/cursors/SelectCursor";
import { StatusFreeHandler } from "../handlers/StatusFreeHandler";
import { StatusPanHandler } from "../handlers/StatusPanHandler";
import { StatusSelectHandler } from "../handlers/StatusSelectHandler";
import { Status } from "./functions";

export default function statusReducer(state, action) {
    switch (action.type) {
        case ScreenActions.ABORT:
            return {
                result: true,
                newState: {
                    ...state, status: Status.FREE, curShape: null, cursor: new SelectCursor(state.curRealPoint),
                    mouseHandler: new StatusFreeHandler(state)
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
                mouseHandler: new StatusFreeHandler(state),
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
                    mouseHandler: new StatusFreeHandler(state)
                }
            }

        case ScreenActions.CANCEL_SELECTION:
            state.panels.forEach(s => s.setState({ selected: false, underCursor: false, highlighted: false, inSelection: false }))
            state.dimensions.forEach(s => s.setState({ selected: false, underCursor: false, highlighted: false, inSelection: false }))
            return {
                result: true,
                newState: {
                    ...state,
                    status: Status.FREE,
                    selectedPanels: new Set(),
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
                    mouseHandler: new StatusSelectHandler(action.payload, state)
                }
            }

        case ScreenActions.STOP_SELECTION:
            const selectedPanels = action.payload ? state.selectedPanels : new Set()
            return {
                result: true, newState: {
                    ...state,
                    status: Status.FREE,
                    selectedPanels,
                    cursor: new SelectCursor(state.curRealPoint),
                    mouseHandler: new StatusFreeHandler(state),
                }
            };

        case ModelActions.UPDATE_STATE:
            //const selectedPanels = new Set()
            //state.panels.forEach(p => {if(p.state.selected) selectedPanels.add(p)})
            return { result: true, newState: { ...state } }

        default: {
            return { result: false, newState: state }
        }
    }
}