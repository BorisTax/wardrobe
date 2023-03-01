import React from 'react';
import { useSelector } from 'react-redux';
import useActions from '../customHooks/useActions';
import MoveButtonsPanel from './MoveButtonsPanel';
import ToolBar from './ToolBar';
import ToolButton from './ToolButton';
import ToolButtonBar from './ToolButtonBar';

export default function OperationsBar(){
    const captions = useSelector(store => store.captions.toolbars.operations)
    const appActions = useActions()
    return <ToolBar caption={captions.title}>
        <ToolButtonBar>
            <MoveButtonsPanel/>
            <ToolButton icon="resetView" title={captions.resetView} onClick={()=>{appActions.resetView()}}/>
        </ToolButtonBar>
        </ToolBar>
}