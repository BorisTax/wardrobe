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
        abort: () => dispatch(ScreenActions.abort()),
        addDimension: (dimension) => dispatch(ShapeActions.addDimension(dimension)),
        addShape: (shape) => dispatch(ScreenActions.addShape(shape)),
        cancel: () => dispatch(ScreenActions.cancel()),
        cancelMoving: () => dispatch(ScreenActions.cancelMoving()),
        createPanel: (options) => dispatch(ShapeActions.createPanel(options)),
        createSingleDimension: () => dispatch(ShapeActions.createSingleDimension()),
        createTwoPanelDimension: ({inside}) => dispatch(ShapeActions.createTwoPanelDimension({inside})),
        deleteConfirm: () => dispatch(ScreenActions.deleteConfirm()),
        deleteSelectedPanels: () => dispatch(ScreenActions.deleteSelectedPanels()),
        loadDetailList: (listKey) => dispatch(ModelActions.loadDetailList(listKey)),
        logout: () => dispatch(UserActions.logout()),
        movePanel: (panel, movePoint) => dispatch(ShapeActions.movePanel(panel, movePoint)),
        open: () => dispatch(ModelActions.openProject()),
        new: () => dispatch(ModelActions.newProjectConfirm()),
        print: ({ save }) => dispatch(ScreenActions.print({ save })),
        requestLanguage: (lang) => dispatch(AppActions.requestLanguage(lang)),
        save: () => dispatch(ModelActions.saveProject()),
        setCursor: (cursor) => dispatch(ScreenActions.setCursor(cursor)),
        setDeleteConfirm: (value) => dispatch(ModelActions.setDeleteConfirm(value)),
        setInformation: (info) => dispatch(ModelActions.setInformation(info)),
        setLanguage: (captions) => dispatch(AppActions.setLanguage(captions)),
        setMaterial: (mat) => dispatch(ModelActions.setMaterial(mat)),
        setPrevStatus: () => dispatch(ScreenActions.setPrevStatus()),
        setRealWidth: (width) => dispatch(ScreenActions.setRealWidth(width)),
        setScale: (scale, anchor) => dispatch(ScreenActions.setScale(scale, anchor)),
        setScreenStatus: (status, params) => dispatch(ScreenActions.setScreenStatus(status, params)),
        setToken: (token, remember) => dispatch(UserActions.setToken(token, remember)),
        setWardrobeDimensions: (dimensions) => dispatch(ModelActions.setWardrobeDimensions(dimensions)),
        showAlert: (show, message) => dispatch(AppActions.showAlert(show, message)),
        showConfirm: (show, messageKey, actions) => dispatch(AppActions.showConfirm(show, messageKey, actions)),
        showHelp: (show) => dispatch(AppActions.showHelp(show)),
        startSelection: (point) => dispatch(ScreenActions.startSelection(point)),
        stopSelection: (isSelectedPanels) => dispatch(ScreenActions.stopSelection(isSelectedPanels)),
        updateState: () => dispatch(ModelActions.updateState()),
    }
}