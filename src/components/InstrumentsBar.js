import React from 'react';
import { useSelector } from 'react-redux';
import useActions from '../customHooks/useActions';
import ToolBar from './ToolBar';
import ToolButton from './ToolButton';
import ToolButtonRow from './ToolButtonRow';

const InstrumentsBar=(props)=>{
    const appActions = useActions()
    const captions = useSelector(store => store.captions.toolbars.instruments)
    return <ToolBar caption={captions.title}>
        <ToolButtonRow>
            <ToolButton icon={"createPanelVertical"} title={captions.createVertical} onClick={()=>{appActions.createPanel({vertical: true})}}/>
            <ToolButton icon={"createPanelHorizontal"} title={captions.createHorizontal} onClick={()=>{appActions.createPanel({vertical: false})}}/>
        </ToolButtonRow>
        </ToolBar>
}
export default InstrumentsBar;