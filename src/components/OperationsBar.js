import React from 'react';
import { useSelector } from 'react-redux';
import useActions from '../customHooks/useActions';
import { canBeDistributed } from '../reducers/panels';
import ToolButton from './ToolButton';
import ToolButtonBar from './ToolButtonBar';

export default function OperationsBar(){
    const captions = useSelector(store => store.captions.toolbars.operations)
    const appActions = useActions()
    const selected = useSelector(store => store).selectedPanels
    const distributeEnabled = canBeDistributed(selected)
    return <>
        <ToolButtonBar>
            <ToolButton icon="resetView" title={captions.resetView} onClick={()=>{appActions.resetView()}}/>
            <ToolButton icon="distribute" disabled={!distributeEnabled} title={captions.distribute} onClick={()=>{appActions.distribute()}}/>
        </ToolButtonBar>
        </>
}