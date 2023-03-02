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
    let blockedInSelected = false
    for (let s of selected) {
        if (s.state.blocked) blockedInSelected = true
        if (s.type === Shape.PANEL) panels.push(s)
        if (s.type === Shape.DIMENSION) { blockedInSelected = true; dimensions.push(s) }
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
    if (panels.length + dimensions.length === 0) {
        contents = captions.noselected
        blockedInSelected = true
    }
    if ((panels.length + dimensions.length > 0) && (panels.length !== 1)) contents = captions.selected + (panels.length + dimensions.length)
    const fixed = blockedInSelected ? true : panels[0].state.fixed
    const buttons = <div>
        <hr />
        <ToolButtonBar>
            <ToolButton title={fixed ? captions.unlock : captions.lock} disabled={blockedInSelected} pressed={fixed} pressedStyle={"lockbutton_pressed"} unpressedStyle={"lockbutton_unpressed"} onClick={() => { appActions.setPanelState({ fixed: !fixed }) }} />
        </ToolButtonBar>
    </div>
    return <ToolBar caption={captions.title}>
        {contents}
        {buttons}
    </ToolBar>
}
