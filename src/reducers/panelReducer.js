import { ScreenActions } from "../actions/ScreenActions";
import { ShapeActions } from "../actions/ShapeActions";
import DimensionCursor from "../components/shapes/cursors/DimensionCursor";
import DragCursor from "../components/shapes/cursors/DragCursor";
import ResizeCursor from "../components/shapes/cursors/ResizeCursor";
import SelectCursor from "../components/shapes/cursors/SelectCursor";
import PanelShape from "../components/shapes/PanelShape"
import Shape from "../components/shapes/Shape";
import { PanelCreateHandler } from "../handlers/PanelCreateHandler";
import { PanelMoveHandler } from "../handlers/PanelMoveHandler";
import { SinglePanelDimensionCreateHandler } from "../handlers/SinglePanelDimensionCreateHandler";
import { StatusFreeHandler } from "../handlers/StatusFreeHandler";
import { TwoPanelDimensionCreateHandler } from "../handlers/TwoPanelDimensionCreateHandler";
import { Status } from "./functions";
import { deleteAllLinksToPanels, selectAllJointedPanels, updateParallelPanels } from "./panels";

export default function panelReducer(state, action) {
    switch (action.type) {
        case ShapeActions.ADD_DIMENSION:
            const dimension = action.payload
            state.dimensions.add(dimension);

            return { result: true, newState: { ...state, status: Status.FREE } };

        case ScreenActions.ADD_PANEL:
            const panel = action.payload
            state.panels.add(panel);
            updateParallelPanels(state.panels)
            return { result: true, newState: { ...state, status: Status.FREE } };

        case ShapeActions.CREATE_PANEL:
            state.panels.forEach(p => { p.setState({ selected: false }) })
            state.selectedPanels = new Set()
            var newState = {
                ...state, curShape: new PanelShape({ ...action.payload, selectable: true, wardrobe: state.wardrobe }),
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

        case ShapeActions.DELETE_SELECTED:
            const panels = new Set()
            deleteAllLinksToPanels(state.panels, state.selectedPanels)
            state.panels.forEach((p) => {
                if (!state.selectedPanels.delete(p)) {
                    panels.add(p);
                }
                else {
                    p.dimensions.forEach(d => { d.delete(); state.dimensions.delete(d) })
                    if (p.singleDimension) { state.dimensions.delete(p.singleDimension); p.singleDimension.delete(); }
                    p.dimensions = new Set()
                }
            });
            const dimensions = new Set()
            state.dimensions.forEach((p) => {
                if (!state.selectedPanels.delete(p)) {
                    dimensions.add(p)
                }
                else state.dimensions.forEach(d => d.delete())
            });

            newState = {
                ...state,
                panels,
                dimensions,
                mouseHandler: new StatusFreeHandler(state),
                cursor: new SelectCursor()
            };
            return { result: true, newState: { ...newState } };

        case ShapeActions.DELETE_SELECTED_CONFIRM:
            for (let p of state.selectedPanels) {
                if (p.type !== Shape.DIMENSION) selectAllJointedPanels(p, state.selectedPanels)
            }
            const showConfirm = { show: true, messageKey: action.payload.isJoints ? "deleteJointedPanels" : "deletePanels", actions: [{ caption: "OK", onClick: ShapeActions.deleteSelected }] }
            return { result: true, newState: { ...state, showConfirm } };

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
            state.selectedPanels.forEach(p => { if (p.type !== Shape.DIMENSION) p.setState(action.payload) })
            return { result: true, newState: { ...state } };

        case ScreenActions.SELECT_PANEL:
            return { result: true, newState: { ...state, selectedPanels: action.payload } };

        default: {
            return { result: false, newState: state }
        }
    }
}