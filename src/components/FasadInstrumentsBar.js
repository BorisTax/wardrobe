import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import useActions from '../customHooks/useActions';
import Counter from './Counter';
import ToolButton from './ToolButton';
import ToolButtonBar from './ToolButtonBar';

export default function FasadInstrumentsBar() {
    const appActions = useActions()
    const [divider, setDivider] = useState(2)
    const captions = useSelector(store => store.captions.toolbars.instruments)
    const pressedStyle = { pressedStyle: "instruments_button_pressed", unpressedStyle: "instruments_button_unpressed" }
    return <>
        <ToolButtonBar>
            <ToolButton icon={"divideFasadHor"} pressed={false} {...pressedStyle} title={captions.divideFasadHor} onClick={() => {appActions.divideFasadHor(divider) }} />
            <ToolButton icon={"divideFasadVert"} pressed={false} {...pressedStyle} title={captions.divideFasadVert} onClick={() => { }} />
            <Counter value={divider} min={2} max={4} setValue={(value) => { setDivider(value) }} />
        </ToolButtonBar>
    </>
}