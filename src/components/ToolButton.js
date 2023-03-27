import React from 'react';
import { useToolTip } from '../customHooks/useToolTip';
export const ToolButtonType = {
        INSTRUMENTS: "INSTRUMENTS"
}
export default function ToolButton({icon, title, type, disabled, pressed, pressedStyle, unpressedStyle, onClick}) {
        let className = "button"
        if(type === ToolButtonType.INSTRUMENTS){
                pressedStyle = pressedStyle || "instruments_button_pressed"
                unpressedStyle = unpressedStyle || "instruments_button_unpressed"
        }
        if(disabled) className += " button-disabled"
        className += pressed ? ` ${pressedStyle}` : ` ${unpressedStyle}`;
        const { onMouseOver, onMouseLeave } = useToolTip(title);
        return <div
                className={`${className} ${icon} noselect`}
                onClick={(e) => { if (!disabled) { e.stopPropagation(); onClick() } }}
                onMouseOver={(e) => { onMouseOver(e) }}
                onMouseLeave={(e) => { onMouseLeave(e) }}
                onContextMenu={(e) => { e.preventDefault(); }}
        >
        </div>
}
