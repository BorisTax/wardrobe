import { WORKSPACE } from "../reducers/initialState";
import { getSelectionData } from "../reducers/panels";
import KeyHandler from "./KeyHandler";

export default class DeleteKeyHandler extends KeyHandler {
    keyPress(e, { handler }) {
        super.keyPress(e, { handler })
    };

    keyUp(e, { appData }) {
        super.keyUp(e)
    };

    keyDown(e, { appData, appActions }) {
        if (super.keyDown(e, { appData, appActions })) return
        const { canBeDeleted, isJoints } = getSelectionData(appData.selectedPanels)
        if (canBeDeleted) 
                    if(appData.workspace === WORKSPACE.CORPUS) 
                            appActions.deleteSelectedConfirm({ isJoints });
                            else appActions.deleteSelectedFasadesConfirm();
    }
}