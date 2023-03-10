import { ModelActions } from "../actions/ModelActions";
import { ScreenActions } from "../actions/ScreenActions";
import NewProjectDialog from "../components/NewProjectDialog";
import PanelShape from "../components/shapes/PanelShape";
import { StatusFreeHandler } from "../handlers/StatusFreeHandler";
import { getNewDate } from "./functions";
import { getInitialState } from "./initialState";
import React from "react";
import PrintPreviewBar from "../components/PrintPreviewBar";

export default function projectReducer(state, action) {
    switch (action.type) {
        case ModelActions.NEW_PROJECT_CONFIRM:
            let showDialog = { show: true, dialog: <NewProjectDialog start = {action.payload}/> }
            return { result: true, newState: { ...state, showDialog } };

        case ModelActions.NEW_PROJECT:
            const initialState = getInitialState({ wardrobe: action.payload.wardrobe })
            initialState.mouseHandler = new StatusFreeHandler(initialState)
            return {
                result: true,
                newState: { ...initialState, materials: state.materials, showDialog: {show: false} }
            };

            
        case ScreenActions.PRINT:
            showDialog = { show: true, dialog: <PrintPreviewBar /> }
            
            return { result: true, newState: { ...state, showDialog } };

        case ModelActions.SET_INFORMATION:
            return { result: true, newState: { ...state, information: { ...action.payload } } }

        case ModelActions.SAVE_PROJECT:
            saveCurrentState(state);
            return { result: true, newState: state };

        case ModelActions.SET_PROJECT:
            const project = action.payload;
            if (!project.project) return { result: true, newState: { ...state, showAlert: { show: true, message: "corruptedProject" } } }
            const newState = loadCurrentState(project.state, state);
            return { result: true, newState: { ...state, ...newState } };

        case ModelActions.SET_WARDROBE_DIMENSIONS:
            const dimensions = action.payload;
            return { result: true, newState: { ...state, wardrobe: { ...state.wardrobe, ...dimensions } } };

        default: {
            return { result: false, newState: state }
        }
    }
}

export function saveCurrentState(state) {
    const saveState = {
        tableMarginLength: state.tableMarginLength,
        tableMarginWidth: state.tableMarginWidth,
        panelMargin: state.panelMargin,
        panels: state.panels.map(p => p.model),
        activeTable: state.activeTable,
        tables: state.tables.map(t => t.model),
        detailList: {
            primary: state.detailList["primary"],
            secondary: state.detailList["secondary"]
        },
        information: { ...state.information },
        material: { ...state.material },
        drawModuleInCaption: state.drawModuleInCaption
    };
    const project = { project: 1.0, state: saveState }
    var contents = JSON.stringify(project);
    var link = document.createElement('a');
    link.setAttribute('download', "project.json");
    link.href = makeTextFile(contents);
    link.click()
}

export function loadCurrentState(state, oldState) {
    const panels = state.panels.map(p => { const panel = new PanelShape({ ...p, drawModule: state.drawModuleInCaption }); panel.state.selected = false; panel.refreshModel(); return panel });
    const newState = {
        panels: panels,
        detailList: {
            primary: state.detailList["primary"],
            secondary: state.detailList["secondary"]
        },
        information: { ...state.information, currentDate: state.information.currentDate || getNewDate() },
    };
    return newState;
}

var textFile = null
var makeTextFile = function (text) {
    var data = new Blob([text], { type: 'application/json' });
    if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
    }
    textFile = window.URL.createObjectURL(data);
    return textFile;
};