import React from 'react';
import { useSelector } from 'react-redux';
import useActions from '../customHooks/useActions';
import ToolButton from './ToolButton';

export default function MoveButtonsPanel(props) {
    const captions = useSelector(store => store.captions.toolbars.instruments)
    const update = useActions().updateState
    const appData = useSelector(store => store)
    const panel = appData.selectedPanels[0]
    const minDist = appData.minDist
    const enabledButtons = { left: false, right: false, up: false, down: false }
    if (panel) {
        enabledButtons.left = panel.vertical
        enabledButtons.right = panel.vertical
        enabledButtons.up = !panel.vertical
        enabledButtons.down = !panel.vertical
    }
    return <div className='moveButtons'>
        <ToolButton icon={"moveLeft"} disabled={!enabledButtons.left} title={captions.moveLeft} onClick={() => { panel.moveTo(-1, 0, minDist); update() }} />
        <ToolButton icon={"moveUp"} disabled={!enabledButtons.up} title={captions.moveUp} onClick={() => { panel.moveTo(0, 1, minDist); update() }} />
        <ToolButton icon={"moveDown"} disabled={!enabledButtons.down} title={captions.moveDown} onClick={() => { panel.moveTo(0, -1, minDist); update() }} />
        <ToolButton icon={"moveRight"} disabled={!enabledButtons.right} title={captions.moveRight} onClick={() => { panel.moveTo(1, 0, minDist); update() }} />
    </div>
}