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
        if (canBeDeleted) appActions.deleteSelectedConfirm({ isJoints })
    }
}