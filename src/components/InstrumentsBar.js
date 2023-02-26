import React from 'react';
import { useSelector } from 'react-redux';
import useActions from '../customHooks/useActions';
import ToolBar from './ToolBar';
import ToolButton from './ToolButton';
import ToolButtonBar from './ToolButtonBar';

const InstrumentsBar=(props)=>{
    const appActions = useActions()
    const captions = useSelector(store => store.captions.toolbars.instruments)
    const {createHorizontal: hor, createVertical: vert, createSingleDimension: single} = useSelector(store => store.toolButtonsPressed)
    const pressedStyle  = {pressedStyle: "instruments_button_pressed", unpressedStyle: "instruments_button_unpressed"}
    return <ToolBar caption={captions.title}>
        <ToolButtonBar>
            <ToolButton icon={"createPanelVertical"} pressed={vert} {...pressedStyle} title={captions.createVertical} onClick={()=>{appActions.createPanel({vertical: true})}}/>
            <ToolButton icon={"createPanelHorizontal"} pressed={hor} {...pressedStyle} title={captions.createHorizontal} onClick={()=>{appActions.createPanel({vertical: false})}}/>
        </ToolButtonBar>
        <ToolButtonBar>
            <ToolButton icon={"createSingleDimension"} pressed={single} {...pressedStyle} title={captions.createSingleDimension} onClick={()=>{appActions.createSingleDimension()}}/>
        </ToolButtonBar>
        </ToolBar>
}
export default InstrumentsBar;