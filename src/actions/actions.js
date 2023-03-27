import { AppActions } from "./AppActions";
import EventsActions from "./EventsActions";
import { ModelActions } from "./ModelActions";
import { ScreenActions } from "./ScreenActions";
import { ShapeActions } from "./ShapeActions";
import UserActions from "./UserActions";

export function getActions(dispatch) {
    return {
        log: (data) => dispatch(EventsActions.log(data)),
        touchDown: () => dispatch(EventsActions.touchDown()),
        touchUp: (touchCount) => dispatch(EventsActions.touchUp(touchCount)),
        touchMove: () => dispatch(EventsActions.touchMove()),
        touchCancel: () => dispatch(EventsActions.touchCancel()),
        activate: () => dispatch(UserActions.activate()),
        addDimension: (dimension) => dispatch(ShapeActions.addDimension(dimension)),
        addFasadeDimension: (dimension) => dispatch(ShapeActions.addFasadeDimension(dimension)),
        addShape: (shape) => dispatch(ScreenActions.addShape(shape)),
        cancel: () => dispatch(ScreenActions.cancel()),
        createDrawer: () => dispatch(ShapeActions.createDrawer()),
        createDrawerBlock: () => dispatch(ShapeActions.createDrawerBlock()),
        createPanel: (options) => dispatch(ShapeActions.createPanel(options)),
        createFasadeDimension: (vertical) => dispatch(ShapeActions.createFasadeDimension(vertical)),
        createSingleDimension: () => dispatch(ShapeActions.createSingleDimension()),
        createTwoPanelDimension: ({ inside }) => dispatch(ShapeActions.createTwoPanelDimension({ inside })),
        createTube: () => dispatch(ShapeActions.createTube()),
        deleteSelected: () => dispatch(ShapeActions.deleteSelected()),
        deleteSelectedConfirm: ({ isJoints }) => dispatch(ShapeActions.deleteSelectedConfirm({ isJoints })),
        deleteSelectedFasades: () => dispatch(ShapeActions.deleteSelectedFasades()),
        deleteSelectedFasadesConfirm: () => dispatch(ShapeActions.deleteSelectedFasadesConfirm()),
        divideFasadHor: (count) => dispatch(ShapeActions.divideFasadHor(count)),
        divideFasadVert: (count) => dispatch(ShapeActions.divideFasadVert(count)),
        distribute: () => dispatch(ShapeActions.distribute()),
        fixMinLength: (fix) => dispatch(ShapeActions.fixMinLength(fix)),
        fixMaxLength: (fix) => dispatch(ShapeActions.fixMaxLength(fix)),
        fixWidth: (fix) => dispatch(ShapeActions.fixWidth(fix)),
        fixHeight: (fix) => dispatch(ShapeActions.fixHeight(fix)),
        loadMaterials: () => dispatch(ModelActions.loadMaterials(dispatch)),
        logout: () => dispatch(UserActions.logout()),
        movePanel: (panel, movePoint) => dispatch(ShapeActions.movePanel(panel, movePoint)),
        open: () => dispatch(ModelActions.openProject()),
        newProjectConfirm: (start) => dispatch(ModelActions.newProjectConfirm(start)),
        newProject: (data) => dispatch(ModelActions.newProject(data)),
        print: ({ save }) => dispatch(ScreenActions.print({ save })),
        resetView: () => dispatch(ScreenActions.resetView()),
        requestLanguage: (lang) => dispatch(AppActions.requestLanguage(lang)),
        save: () => dispatch(ModelActions.saveProject()),
        selectParent: (fasade) => dispatch(ShapeActions.selectParent(fasade)),
        setCursor: (cursor) => dispatch(ScreenActions.setCursor(cursor)),
        setDeleteConfirm: (value) => dispatch(ModelActions.setDeleteConfirm(value)),
        setInformation: (info) => dispatch(ModelActions.setInformation(info)),
        setLanguage: (captions) => dispatch(AppActions.setLanguage(captions)),
        setMaterial: (mat) => dispatch(ModelActions.setMaterial(mat)),
        setLoadedMaterials: (mat) => dispatch(ModelActions.setLoadedMaterials(mat)),
        setPanelState: (state) => dispatch(ShapeActions.setPanelState(state)),
        setPrevStatus: () => dispatch(ScreenActions.setPrevStatus()),
        setProperty: (key, value) => dispatch(ShapeActions.setProperty(key, value)),
        setRealWidth: (width) => dispatch(ScreenActions.setRealWidth(width)),
        setScale: (scale, anchor) => dispatch(ScreenActions.setScale(scale, anchor)),
        setScreenStatus: (status, params) => dispatch(ScreenActions.setScreenStatus(status, params)),
        setToken: (token, remember) => dispatch(UserActions.setToken(token, remember)),
        setWardrobeDimensions: (dimensions) => dispatch(ModelActions.setWardrobeDimensions(dimensions)),
        setWorkspace: (value) => dispatch(ModelActions.setWorkspace(value)),
        showAlert: (show, message) => dispatch(AppActions.showAlert(show, message)),
        showConfirm: (show, messageKey, actions) => dispatch(AppActions.showConfirm(show, messageKey, actions)),
        showDialog: (show, dialog) => dispatch(AppActions.showDialog(show, dialog)),
        showHelp: (show) => dispatch(AppActions.showHelp(show)),
        startSelection: (point, handler) => dispatch(ScreenActions.startSelection(point, handler)),
        stopSelection: (isSelectedPanels, handler) => dispatch(ScreenActions.stopSelection(isSelectedPanels, handler)),
        updateState: () => dispatch(ModelActions.updateState()),
    }
}