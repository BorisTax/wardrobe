import { Checkbox } from '@material-ui/core';
import React, { useId, useRef } from 'react';

export default function CheckBox({value, disabled, title, onChange}){
    //const id = useId();
    //const checkboxRef = useRef()
    return (
        <input type="checkbox"  checked={value} disabled={disabled} onChange={(e) => { onChange(e.target.checked) }}/>
    );
}

