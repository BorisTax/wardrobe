import React from "react";
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import { ModelActions } from "../actions/ModelActions";
import NewProjectDialog from "../components/NewProjectDialog";
import PanelShape from "../components/shapes/PanelShape";
import { PanelFreeHandler } from "../handlers/PanelFreeHandler";
import { getNewDate } from "./functions";
import { getInitialState, WORKSPACE } from "./initialState";
import { exportProject } from "./printPdf";
import { FasadeFreeHandler } from "../handlers/FasadeFreeHandler";
import { SelectionSet } from "./panels";

export default function projectReducer(state, action) {
    switch (action.type) {
        case ModelActions.NEW_PROJECT_CONFIRM:
            let showDialog = { show: true, dialog: <NewProjectDialog start = {action.payload}/> }
            return { result: true, newState: { ...state, showDialog } };

        case ModelActions.NEW_PROJECT:
            const initialState = getInitialState({ wardrobe: action.payload.wardrobe })
            initialState.mouseHandler = new PanelFreeHandler(initialState)
            return {
                result: true,
                newState: { ...initialState, materials: state.materials, showDialog: {show: false} }
            };

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

        case ModelActions.SET_WORKSPACE:
            const mouseHandler = action.payload === WORKSPACE.CORPUS ? new PanelFreeHandler(state) : new FasadeFreeHandler(state)
            state.selectedPanels.clear()
            return { result: true, newState: { ...state, workspace: action.payload, mouseHandler } };

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
    const img1 = image[0].split(",")[1]
    const img2 = image[1].split(",")[1]
    const zip = new JSZip()
    zip.file('project.json', contents)
    zip.file('корпус.png', img1, {base64: true})
    zip.file('фасад.png', img2, {base64: true})
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
