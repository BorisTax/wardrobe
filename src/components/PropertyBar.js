import React from 'react';
import ToolBar from './ToolBar';
import ToolButton from './ToolButton';
import ToolButtonBar from './ToolButtonBar';
import { useSelector } from 'react-redux';
import useActions from '../customHooks/useActions';
import Shape from './shapes/Shape';

export default function PropertyBar() {
    const captions = useSelector(store => store.captions.toolbars.property)
    const appActions = useActions()
    const selected = useSelector(store => store.selectedPanels)
    let panels = []
    let dimensions = []
    let fixDisabled = false
    let deleteDisabled = false
    let fixed = true
    for (let s of selected) {
        if (!s.state.deleteable) deleteDisabled = true
        if (!s.state.fixable) fixDisabled = true
        if (s.type === Shape.PANEL) panels.push(s)
        if (s.type === Shape.DIMENSION) { dimensions.push(s) }
    }
    let contents = <></>
    if (panels.length === 1) {
        const selected = panels[0]
        contents = <div className='detailPropertyContent'>
            <div>{captions.name}</div><input value={selected.model.name} onChange={e => { selected.model.name = e.target.value; appActions.updateState() }} />
            <div>{captions.length}</div><div>{selected.model.length}</div>
            <div>{captions.width}</div><div>{selected.model.width}</div>
        </div>
    }
    if (panels.length > 0) fixed = panels[0].state.fixed
    if (panels.length + dimensions.length === 0) {
        contents = captions.noselected
        fixDisabled = true
        deleteDisabled = true
    }
    if ((panels.length + dimensions.length > 0) && (panels.length !== 1)) contents = captions.selected + (panels.length + dimensions.length)
    const buttons = <div>
        <hr />
        <ToolButtonBar>
            <ToolButton title={fixed ? captions.unlock : captions.lock} disabled={fixDisabled} pressed={fixed} pressedStyle={"lockbutton_pressed"} unpressedStyle={"lockbutton_unpressed"} onClick={() => { appActions.setPanelState({ fixed: !fixed }) }} />
            <ToolButton title={captions.delete} disabled={deleteDisabled} pressed={fixed} pressedStyle={"deletebutton"} unpressedStyle={"deletebutton"} onClick={() => { appActions.deleteSelectedConfirm() }} />
        </ToolButtonBar>
    </div>
    return <ToolBar caption={captions.title}>
        {contents}
        {buttons}
    </ToolBar>
}
