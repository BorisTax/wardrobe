import React from 'react';
import { useSelector } from 'react-redux';
import useActions from '../customHooks/useActions';
import ToolButton from './ToolButton';
import ToolButtonBar from './ToolButtonBar';

export default function FasadeDimensionsBar(){
    const appActions = useActions()
    const captions = useSelector(store => store.captions.toolbars.instruments)
    const {createFasadLengthDimension: length, createFasadWidthDimension: width} = useSelector(store => store.toolButtonsPressed)
    const pressedStyle  = {pressedStyle: "instruments_button_pressed", unpressedStyle: "instruments_button_unpressed"}
    return <>
        <ToolButtonBar>
            <ToolButton icon={"createFasadeLengthDimension"} pressed={length} {...pressedStyle} title={captions.createFasadeLengthDimension} onClick={()=>{appActions.createFasadeDimension(true)}}/>
            <ToolButton icon={"createFasadeWidthDimension"} pressed={width} {...pressedStyle} title={captions.createFasadeWidthDimension} onClick={()=>{appActions.createFasadeDimension(false)}}/>
        </ToolButtonBar>
        </>
}