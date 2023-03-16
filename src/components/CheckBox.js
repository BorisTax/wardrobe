import React from 'react';

export default function CheckBox({value, disabled, title, onChange}){
    return (
        <input type="checkbox"  checked={value} disabled={disabled} onChange={(e) => { onChange(e.target.checked) }}/>
    );
}

