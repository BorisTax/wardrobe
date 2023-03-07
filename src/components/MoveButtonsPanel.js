import React from 'react';
import { useSelector } from 'react-redux';
import useActions from '../customHooks/useActions';
import { moveSelectedPanels, setWardrobeDimensions } from '../reducers/panels';
import Shape from './shapes/Shape';
import ToolButton from './ToolButton';

export default function MoveButtonsPanel() {
    const captions = useSelector(store => store.captions.toolbars.operations)
    const update = useActions().updateState
    const appData = useSelector(store => store)
    const appActions = useActions()
    const panels = Array.from(appData.selectedPanels).filter(p => p.type !== Shape.DIMENSION)
    const fixed = panels.some(p => p.state.fixed_move)
    //appData.selectedPanels.forEach(p => panels.push(p))
    const enabledButtons = { left: false, right: false, up: false, down: false }
    //const panel = panels[0]
    if (panels.length > 0 && !fixed) {
        enabledButtons.left = panels.vertical
        enabledButtons.right = panels.vertical
        enabledButtons.up = !panels.vertical
        enabledButtons.down = !panels.vertical
    }

    return <div className='moveButtons'>
        <ToolButton icon={"moveLeft"} disabled={!enabledButtons.left} title={captions.moveLeft} onClick={() => { moveSelectedPanels(-1, 0, panels[0], panels, () => { setWardrobeDimensions(appData, appActions) }); update() }} />
        <ToolButton icon={"moveUp"} disabled={!enabledButtons.up} title={captions.moveUp} onClick={() => { moveSelectedPanels(0, 1, panels[0], panels,  () => { setWardrobeDimensions(appData, appActions) }); update() }} />
        <ToolButton icon={"moveDown"} disabled={!enabledButtons.down} title={captions.moveDown} onClick={() => { moveSelectedPanels(0, -1, panels[0], panels, () => { setWardrobeDimensions(appData, appActions) }); update() }} />
        <ToolButton icon={"moveRight"} disabled={!enabledButtons.right} title={captions.moveRight} onClick={() => { moveSelectedPanels(1, 0, panels[0], panels,  () => { setWardrobeDimensions(appData, appActions) }); update() }} />
    </div>
}