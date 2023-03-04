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
    let fixed_move = true
    let fixedLength = {min: true, max: true}
    let contents = <></>
    if (panelCount === 1) {
        const selected = firstSelected
        contents = <div className='detailPropertyContent'>
            <div>{captions.name}</div><input value={selected.model.name} onChange={e => { selected.model.name = e.target.value; appActions.updateState() }} />
            <div>{captions.length}</div><div>{selected.model.length}</div>
            <div>{captions.width}</div><div>{selected.model.width}</div>
        </div>
    }
    if (panelCount > 0) {
        fixed_move = firstSelected.state.fixed_move
        fixedLength = firstSelected.state.fixedLength
    }
    let noSelected = false
    if (panelCount + dimensionCount === 0) {
        contents = captions.noselected
        noSelected = true
    }
    if ((panelCount + dimensionCount > 0) && (panelCount !== 1)) contents = captions.selected + (panelCount + dimensionCount)
    const buttons = !noSelected?<div>
        <hr />
        <ToolButtonBar>
            <ToolButton title={fixed_move ? captions.unlock_move : captions.lock_move} disabled={!canBeFixed} pressed={fixed_move} pressedStyle={"lockmovebutton_pressed"} unpressedStyle={"lockmovebutton_unpressed"} onClick={() => { appActions.setPanelState({ fixed_move: !fixed_move }) }} />
            <ToolButton title={fixedLength.min ? captions.unlock_minlength : captions.lock_minlength} disabled={!canBeFixed} pressed={fixedLength.min} pressedStyle={"lockminlengthbutton_pressed"} unpressedStyle={"lockminlengthbutton_unpressed"} onClick={() => { appActions.fixLength(!fixedLength.min, fixedLength.max) }} />
            <ToolButton title={fixedLength.max ? captions.unlock_maxlength : captions.lock_maxlength} disabled={!canBeFixed} pressed={fixedLength.max} pressedStyle={"lockmaxlengthbutton_pressed"} unpressedStyle={"lockmaxlengthbutton_unpressed"} onClick={() => { appActions.fixLength(fixedLength.min, !fixedLength.max) }} />
            <ToolButton title={captions.delete} disabled={!canBeDeleted} pressedStyle={"deletebutton"} unpressedStyle={"deletebutton"} onClick={() => { appActions.deleteSelectedConfirm({isJoints}) }} />
        </ToolButtonBar>
    </div>:<></>
    return <ToolBar caption={captions.title}>
        {contents}
        {buttons}
    </ToolBar>
}
