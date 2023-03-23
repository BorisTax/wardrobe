import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import useActions from '../customHooks/useActions';
import Counter from './Counter';
import FasadeShape from './shapes/FasadeShape';
import Shape from './shapes/Shape';
import ToolButton from './ToolButton';
import ToolButtonBar from './ToolButtonBar';

export default function FasadInstrumentsBar() {
    const appActions = useActions()
    const [divider, setDivider] = useState(2)
    const captions = useSelector(store => store.captions.toolbars.instruments)
    const selected = Array.from(useSelector(store => store).selectedPanels)
    const selectedPanels = selected.filter(p => p.type !== Shape.DIMENSION)
    const horDivideEnable = selectedPanels.every(p => !(p.parent && (p.parent.divided === FasadeShape.HOR)) && p.level < 3 && !p.hasChildren())
    const vertDivideEnable = selectedPanels.every(p => !(p.parent && (p.parent.divided === FasadeShape.VERT)) && p.level < 3 && !p.hasChildren())
    
    const pressedStyle = { pressedStyle: "instruments_button_pressed", unpressedStyle: "instruments_button_unpressed" }
    return <>
        <ToolButtonBar>
            <ToolButton icon={"divideFasadHor"} disabled={!horDivideEnable} pressed={false} {...pressedStyle} title={captions.divideFasadHor} onClick={() => {appActions.divideFasadHor(divider) }} />
            <ToolButton icon={"divideFasadVert"} disabled={!vertDivideEnable} pressed={false} {...pressedStyle} title={captions.divideFasadVert} onClick={() => {appActions.divideFasadVert(divider)  }} />
            <Counter value={divider} min={2} max={4} setValue={(value) => { setDivider(value) }} />
        </ToolButtonBar>
    </>
}