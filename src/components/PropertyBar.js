import React from 'react';
import ToolBar from './ToolBar';
import ToolButton from './ToolButton';
import ToolButtonBar from './ToolButtonBar';
import { useSelector } from 'react-redux';
import useActions from '../customHooks/useActions';
import { getSelectionData } from '../reducers/panels';

export default function PropertyBar() {
    const captions = useSelector(store => store.captions.toolbars.property)
    const appActions = useActions()
    const selected = useSelector(store => store.selectedPanels)
    const {canBeDeleted, canBeFixed,  panelCount, firstSelected, dimensionCount, isJoints} = getSelectionData(selected)
    let fixed = true
    let contents = <></>
    if (panelCount === 1) {
        const selected = firstSelected
        contents = <div className='detailPropertyContent'>
            <div>{captions.name}</div><input value={selected.model.name} onChange={e => { selected.model.name = e.target.value; appActions.updateState() }} />
            <div>{captions.length}</div><div>{selected.model.length}</div>
            <div>{captions.width}</div><div>{selected.model.width}</div>
        </div>
    }
    if (panelCount > 0) fixed = firstSelected.state.fixed
    if (panelCount + dimensionCount === 0) {
        contents = captions.noselected
    }
    if ((panelCount + dimensionCount > 0) && (panelCount !== 1)) contents = captions.selected + (panelCount + dimensionCount)
    const buttons = <div>
        <hr />
        <ToolButtonBar>
            <ToolButton title={fixed ? captions.unlock : captions.lock} disabled={!canBeFixed} pressed={fixed} pressedStyle={"lockbutton_pressed"} unpressedStyle={"lockbutton_unpressed"} onClick={() => { appActions.setPanelState({ fixed: !fixed }) }} />
            <ToolButton title={captions.delete} disabled={!canBeDeleted} pressed={fixed} pressedStyle={"deletebutton"} unpressedStyle={"deletebutton"} onClick={() => { appActions.deleteSelectedConfirm({isJoints}) }} />
        </ToolButtonBar>
    </div>
    return <ToolBar caption={captions.title}>
        {contents}
        {buttons}
    </ToolBar>
}
