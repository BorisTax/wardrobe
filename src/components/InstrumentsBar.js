import React from 'react';
import { useSelector } from 'react-redux';
import useActions from '../customHooks/useActions';
import Shape from './shapes/Shape';
import ToolButton from './ToolButton';
import ToolButtonBar from './ToolButtonBar';

export default function InstrumentsBar(){
    const appActions = useActions()
    const captions = useSelector(store => store.captions.toolbars.instruments)
    const {createHorizontal: hor, createVertical: vert, createDrawer: drawer, createDrawerBlock: drawerBlock} = useSelector(store => store.toolButtonsPressed)
    const pressedStyle  = {pressedStyle: "instruments_button_pressed", unpressedStyle: "instruments_button_unpressed"}
    return <>
        <ToolButtonBar>
            <ToolButton icon={"createPanelVertical"} pressed={vert} {...pressedStyle} title={captions.createVertical} onClick={()=>{appActions.createPanel({vertical: true})}}/>
            <ToolButton icon={"createPanelHorizontal"} pressed={hor} {...pressedStyle} title={captions.createHorizontal} onClick={()=>{appActions.createPanel({vertical: false})}}/>
            <ToolButton icon={"createDrawer"} pressed={drawer} {...pressedStyle} title={captions.createDrawer} onClick={()=>{appActions.createDrawer(Shape.DRAWER_OPTIONS)}}/>
            <ToolButton icon={"createDrawerBlock"} pressed={drawerBlock} {...pressedStyle} title={captions.createDrawerBlock} onClick={()=>{appActions.createDrawerBlock(Shape.DRAWERBLOCK_OPTIONS)}}/>
        </ToolButtonBar>
        </>
}