import { ScreenActions } from "../actions/ScreenActions";
import { ShapeActions } from "../actions/ShapeActions";
import DimensionCursor from "../components/shapes/cursors/DimensionCursor";
import DragCursor from "../components/shapes/cursors/DragCursor";
import ResizeCursor from "../components/shapes/cursors/ResizeCursor";
import SelectCursor from "../components/shapes/cursors/SelectCursor";
import PanelShape from "../components/shapes/PanelShape"
import { PanelCreateHandler } from "../handlers/PanelCreateHandler";
import { PanelMoveHandler } from "../handlers/PanelMoveHandler";
import { SinglePanelDimensionCreateHandler } from "../handlers/SinglePanelDimensionCreateHandler";
import { StatusFreeHandler } from "../handlers/StatusFreeHandler";
import { TwoPanelDimensionCreateHandler } from "../handlers/TwoPanelDimensionCreateHandler";
import { Status } from "./functions";
import { updateParallelPanels } from "./panels";

export default function panelReducer(state, action) {
    switch (action.type) {
        case ShapeActions.ADD_DIMENSION:
            const dimension = action.payload
            state.dimensions.add(dimension);

            return { result: true, newState: { ...state, status: Status.FREE } };

        case ScreenActions.ADD_PANEL:
            const panel = action.payload
            state.panels.push(panel);
            updateParallelPanels(state.panels)
            return { result: true, newState: { ...state, status: Status.FREE } };

        case ShapeActions.CREATE_PANEL:
            state.panels.forEach(p => { p.setState({ selected: false }) })
            state.selectedPanels = new Set()
            var newState = {
                ...state, curShape: new PanelShape({ ...action.payload, selectable: true }),
                cursor: new DragCursor(state.curRealPoint),
                status: Status.CREATE,
                toolButtonsPressed: {
                    createVertical: action.payload.vertical,
                    createHorizontal: !action.payload.vertical,
                    createSingleDimension: false,
                    createTwoPanelDimension: false,
                }
            }
            return { result: true, newState: { ...newState, mouseHandler: new PanelCreateHandler(newState, true) } };

        case ShapeActions.CREATE_SINGLE_DIMENSION:
            newState = {
                ...state,
                toolButtonsPressed: {
                    createVertical: false,
                    createHorizontal: false,
                    createSingleDimension: true,
                    createTwoPanelDimension: false,
                }, cursor: new DimensionCursor(state.curRealPoint)//, status: Status.CREATE
            }
            return { result: true, newState: { ...newState, mouseHandler: new SinglePanelDimensionCreateHandler(newState) } };
        case ShapeActions.CREATE_TWO_PANEL_DIMENSION:
            newState = {
                ...state,
                toolButtonsPressed: {
                    createVertical: false,
                    createHorizontal: false,
                    createSingleDimension: false,
                    createTwoPanelDimensionInside: action.payload.inside,
                    createTwoPanelDimensionOutside: !action.payload.inside,
                }, cursor: new DimensionCursor(state.curRealPoint)//, status: Status.CREATE
            }
            return { result: true, newState: { ...newState, mouseHandler: new TwoPanelDimensionCreateHandler(newState, action.payload.inside) } };
        case ScreenActions.DELETE_CONFIRM:
            const showConfirm = (state.panels.some(s => s.state.selected)) ? { show: true, messageKey: "deletePanels", actions: [{ caption: "OK", onClick: ScreenActions.deleteSelectedPanels }] } : { show: false }
            return { result: true, newState: { ...state, showConfirm } }

        case ScreenActions.DELETE_SELECTED_PANELS:
            const panels = state.panels.filter((p) => {
                if (p.state.selected) state.detailList[p.model.listKey].forEach(d => { if (p.getId() === d.id) d.created--; })
                return !p.getState().selected;
            });
            newState = {
                ...state,
                panels,
                selectedPanels: new Set(),
                mouseHandler: new StatusFreeHandler(state),
                cursor: new SelectCursor()
            };
            return { result: true, newState: { ...newState, detailList: { ...newState.detailList } } };

        case ShapeActions.MOVE_PANEL:
            newState = {
                ...state, curShape: action.payload.panel,
                cursor: new ResizeCursor(state.curRealPoint, action.payload.panel.vertical),
            }
            return {
                result: true,
                newState: {
                    ...newState,
                    mouseHandler: new PanelMoveHandler(newState, false, action.payload.movePoint)
                }
            };

        case ShapeActions.SET_PANEL_STATE:
            state.selectedPanels.forEach(p => p.setState(action.payload))
            return { result: true, newState: { ...state} };

        case ScreenActions.SELECT_PANEL:
            return { result: true, newState: { ...state, selectedPanels: action.payload } };

        default: {
            return { result: false, newState: state }
        }
    }
}