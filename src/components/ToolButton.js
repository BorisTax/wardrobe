import React from 'react';
import { useToolTip } from '../customHooks/useToolTip';

export default function ToolButton(props) {
        let className = "button"
        if(props.disabled) className += " button-disabled"
        className += props.pressed ? ` ${props.pressedStyle}` : ` ${props.unpressedStyle}`;
        const { onMouseOver, onMouseLeave } = useToolTip(props.title);
        return <div
                className={`${className} ${props.icon} noselect`}
                onClick={(e) => { if (!props.disabled) { e.stopPropagation(); props.onClick() } }}
                onMouseOver={(e) => { onMouseOver(e) }}
                onMouseLeave={(e) => { onMouseLeave(e) }}
                onContextMenu={(e) => { e.preventDefault(); }}
        >
        </div>
}
