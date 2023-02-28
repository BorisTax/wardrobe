import React from 'react';
import { useSelector } from 'react-redux';
import MoveButtonsPanel from './MoveButtonsPanel';
import ToolBar from './ToolBar';
import ToolButtonBar from './ToolButtonBar';

export default function OperationsBar(){
    const captions = useSelector(store => store.captions.toolbars.operations)
    return <ToolBar caption={captions.title}>
        <ToolButtonBar>
            <MoveButtonsPanel/>
        </ToolButtonBar>
        </ToolBar>
}