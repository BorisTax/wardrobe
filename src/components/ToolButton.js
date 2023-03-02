import React from 'react';
import { useToolTip } from '../customHooks/useToolTip';

export default function ToolButton({icon, title, disabled, pressed, pressedStyle, unpressedStyle, onClick}) {
        let className = "button"
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
