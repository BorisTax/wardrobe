import { ScreenActions } from "../actions/ScreenActions";
import { ShapeActions } from "../actions/ShapeActions";
import DimensionCursor from "../components/shapes/cursors/DimensionCursor";
import DragCursor from "../components/shapes/cursors/DragCursor";
import ResizeCursor from "../components/shapes/cursors/ResizeCursor";
import SelectCursor from "../components/shapes/cursors/SelectCursor";
import DrawerBlockShape from "../components/shapes/DrawerBlockShape";
import DrawerShape from "../components/shapes/DrawerShape";
import PanelShape from "../components/shapes/PanelShape"
import Shape from "../components/shapes/Shape";
import TubeShape from "../components/shapes/TubeShape";
import { PanelCreateHandler } from "../handlers/PanelCreateHandler";
import { PanelMoveHandler } from "../handlers/PanelMoveHandler";
import { SinglePanelDimensionCreateHandler } from "../handlers/SinglePanelDimensionCreateHandler";
import { PanelFreeHandler } from "../handlers/PanelFreeHandler";
import { FasadeFreeHandler } from "../handlers/FasadeFreeHandler";
import { TwoPanelDimensionCreateHandler } from "../handlers/TwoPanelDimensionCreateHandler";
import { Status } from "./functions";
import { bringSelectedToFront, deleteAllLinksToPanels, distribute, divideFasadesHor, divideFasadesVert, selectAllChildrenFasades, selectAllJointedPanels, updateParallelPanels } from "./panels";

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
            return { result: true, newState: { ...state, } };

        case ShapeActions.CREATE_DRAWER:
            state.selectedPanels = new Set()
            var newState = {
                ...state, curShape: new DrawerShape({ wardrobe: state.wardrobe }),
                cursor: new DragCursor(state.curRealPoint),
                status: Status.CREATE,
                toolButtonsPressed: getButtonPressed({
                    createDrawer: true,
                })
            }
            return { result: true, newState: { ...newState, mouseHandler: new PanelCreateHandler(newState, true) } };

        case ShapeActions.CREATE_DRAWERBLOCK:
            state.selectedPanels = new Set()
            newState = {
                ...state, curShape: new DrawerBlockShape({ wardrobe: state.wardrobe }),
                cursor: new DragCursor(state.curRealPoint),
                status: Status.CREATE,
                toolButtonsPressed: getButtonPressed({
                    createDrawerBlock: true,
                })
            }
            return { result: true, newState: { ...newState, mouseHandler: new PanelCreateHandler(newState, true) } };

        case ShapeActions.CREATE_PANEL:
            state.panels.forEach(p => { p.setState({ selected: false }) })
            state.selectedPanels = new Set()
            newState = {
                ...state, curShape: new PanelShape({ ...action.payload, wardrobe: state.wardrobe }),
                cursor: new DragCursor(state.curRealPoint),
                status: Status.CREATE,
                toolButtonsPressed: getButtonPressed({
                    createVertical: action.payload.vertical,
                    createHorizontal: !action.payload.vertical,
                })
            }
            return { result: true, newState: { ...newState, mouseHandler: new PanelCreateHandler(newState, true) } };

        case ShapeActions.CREATE_TUBE:
            state.selectedPanels = new Set()
            newState = {
                ...state, curShape: new TubeShape({ wardrobe: state.wardrobe }),
                cursor: new DragCursor(state.curRealPoint),
                status: Status.CREATE,
                toolButtonsPressed: getButtonPressed({
                    createTube: true,
                })
            }
            return { result: true, newState: { ...newState, mouseHandler: new PanelCreateHandler(newState, true) } };

        case ShapeActions.CREATE_SINGLE_DIMENSION:
            newState = {
                ...state,
                toolButtonsPressed: getButtonPressed({
                    createSingleDimension: true,
                }), cursor: new DimensionCursor(state.curRealPoint)//, status: Status.CREATE
            }
            return { result: true, newState: { ...newState, mouseHandler: new SinglePanelDimensionCreateHandler(newState) } };
        case ShapeActions.CREATE_TWO_PANEL_DIMENSION:
            newState = {
                ...state,
                toolButtonsPressed: getButtonPressed({
                    createTwoPanelDimensionInside: action.payload.inside,
                    createTwoPanelDimensionOutside: !action.payload.inside,
                }), cursor: new DimensionCursor(state.curRealPoint)//, status: Status.CREATE
            }
            return { result: true, newState: { ...newState, mouseHandler: new TwoPanelDimensionCreateHandler(newState, action.payload.inside) } };

        case ShapeActions.DELETE_SELECTED:
            let panels = new Set()
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
            let dimensions = new Set()
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
                mouseHandler: new PanelFreeHandler(state),
                cursor: new SelectCursor()
            };
            return { result: true, newState: { ...newState } };

        case ShapeActions.DELETE_SELECTED_CONFIRM:
            for (let p of state.selectedPanels) {
                if (p.type !== Shape.DIMENSION) selectAllJointedPanels(p, state.selectedPanels)
            }
            let showConfirm = { show: true, messageKey: action.payload.isJoints ? "deleteJointedPanels" : "deletePanels", actions: [{ caption: "OK", onClick: ShapeActions.deleteSelected }] }
            return { result: true, newState: { ...state, showConfirm } };


        case ShapeActions.DELETE_SELECTED_FASADES:
            let fasades = new Set()
            const extSelectedFasades = selectAllChildrenFasades(state.selectedPanels)
            extSelectedFasades.forEach(s => state.selectedPanels.add(s))
            state.fasades.forEach((p) => {
                if (!state.selectedPanels.delete(p)) {
                    fasades.add(p);
                }
                else {
                    p.dimensions.forEach(d => { d.delete(); state.dimensions.delete(d) })
                    p.dimensions = new Set()
                }
            });
            let fasadeDimensions = new Set()
            state.fasadeDimensions.forEach((p) => {
                if (!state.selectedPanels.delete(p)) {
                    fasadeDimensions.add(p)
                }
                else state.fasadeDimensions.forEach(d => d.delete())
            });
            newState = {
                ...state,
                fasades,
                fasadeDimensions,
                mouseHandler: new FasadeFreeHandler(state),
                cursor: new SelectCursor()
            };
            return { result: true, newState: { ...newState } };
    
        case ShapeActions.DELETE_SELECTED_FASADES_CONFIRM:
            showConfirm = { show: true, messageKey: "deletePanels", actions: [{ caption: "OK", onClick: ShapeActions.deleteSelectedFasades }] }
            return { result: true, newState: { ...state, showConfirm } };

        case ShapeActions.DISTRIBUTE:
            distribute(state.selectedPanels)
            return { result: true, newState: { ...state } };

        case ShapeActions.DIVIDE_FASAD_HOR:
            let newFasades = divideFasadesHor(state.selectedPanels, action.payload)
            newFasades.forEach(f => state.fasades.add(f))
            return { result: true, newState: { ...state, selectedPanels: new Set() } };
    
        case ShapeActions.DIVIDE_FASAD_VERT:
            newFasades = divideFasadesVert(state.selectedPanels, action.payload)
            newFasades.forEach(f => state.fasades.add(f))
            return { result: true, newState: { ...state, selectedPanels: new Set() } };


        case ShapeActions.FIX_LENGTH:
            state.selectedPanels.forEach(p => { if (p.type !== Shape.DIMENSION) p.fixLength(action.payload) })
            return { result: true, newState: { ...state } };

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

        case ShapeActions.SELECT_PARENT:
            action.payload.parent.state.hidden = false
            state.selectedPanels = new Set([action.payload.parent])
            state.fasades = bringSelectedToFront(state.fasades, state.selectedPanels)
            return { result: true, newState: { ...state } };

        case ShapeActions.SET_PANEL_STATE:
            state.selectedPanels.forEach(p => { if (p.type !== Shape.DIMENSION) p.setState(action.payload) })
            return { result: true, newState: { ...state } };

        case ShapeActions.SET_PROPERTY:
            state.selectedPanels.forEach(p => { if (p.type !== Shape.DIMENSION) p.setProperty(action.payload) })
            return { result: true, newState: { ...state } };

        case ScreenActions.SELECT_PANEL:
            return { result: true, newState: { ...state, selectedPanels: action.payload } };

        default: {
            return { result: false, newState: state }
        }
    }
}

export function getButtonPressed(buttons){
    const buttonPressed = {
        createVertical: false,
        createHorizontal: false,
        createDrawer: false,
        createTube: false,
        createSingleDimension: false,
        createTwoPanelDimensionInside: false,
        createTwoPanelDimensionOutside: false,
    }
    return {buttonPressed, ...buttons}
}