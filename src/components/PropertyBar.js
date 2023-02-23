import React from 'react';
import ToolBar from './ToolBar';
import useActions from '../customHooks/useActions';
import ToolButton from './ToolButton';
import TextBox from './TextBox';
import { useSelector } from 'react-redux';

export default function PropertyBar(props) {
    const appActions = useActions()
    const captions = useSelector(store => store.captions.toolbars.property)
    const deleteConfirm = useSelector(store => store.deleteConfirm)
    let panel;
    let message = '';

    return <ToolBar caption={captions.title}>
        <div style={{ display: "flex", flexDirection: "column", flexWrap: "wrap" }}>
            <span style={{ fontSize: "medium" }}>{panel}</span>
            <TextBox text={message} extClass = {["textbox-wrap"]}/>
        </div>
    </ToolBar>
}
