import React from "react";
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import { ModelActions } from "../actions/ModelActions";
import NewProjectDialog from "../components/NewProjectDialog";
import PanelShape from "../components/shapes/PanelShape";
import { StatusFreeHandler } from "../handlers/StatusFreeHandler";
import { getNewDate } from "./functions";
import { getInitialState } from "./initialState";
import { exportProject } from "./printPdf";

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

            
        // case ScreenActions.PRINT:
        //     showDialog = { show: true, dialog: <PrintPreviewBar /> }
            
        //     return { result: true, newState: { ...state, showDialog } };

        case ModelActions.SET_INFORMATION:
            return { result: true, newState: { ...state, information: { ...action.payload } } }

        case ModelActions.SAVE_PROJECT:
            exportProject(state);
            return { result: true, newState: state };

        case ModelActions.SET_PROJECT:
            const project = action.payload;
            if (!project.project) return { result: true, newState: { ...state, showAlert: { show: true, message: "corruptedProject" } } }
            const newState = loadCurrentState(project.state, state);
            return { result: true, newState: { ...state, ...newState } };

        case ModelActions.SET_WARDROBE_DIMENSIONS:
            const dimensions = action.payload;
            if(state.wardrobe.double){
                dimensions.width1 = Array.from(state.panels)[0].length
                dimensions.width2 = Array.from(state.panels)[1].length
            }
            return { result: true, newState: { ...state, wardrobe: { ...state.wardrobe, ...dimensions } } };

        default: {
            return { result: false, newState: state }
        }
    }
}

export function saveCurrentState(state, image) {
    const saveState = {
        //panels: state.panels.map(p => p.model),
    };
    const project = { project: 1.0, state: saveState }
    var contents = JSON.stringify(project);
    const img = image.split(",")[1]
    const zip = new JSZip()
    zip.file('project.json', contents)
    zip.file('project.png', img, {base64: true})
    zip.generateAsync({type: 'blob'}).then(cont => FileSaver.saveAs(cont, 'project.zip'))

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
