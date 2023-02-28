import React from 'react';
import ToolBar from './ToolBar';
import CheckBox from './CheckBox'
import { useSelector } from 'react-redux';
import useActions from '../customHooks/useActions';

export default function PropertyBar(props) {
    const captions = useSelector(store => store.captions.toolbars.property)
    const appActions = useActions()
    let selected = useSelector(store => store.panels).filter(d => d.state.selected)
    if (selected) { selected = selected[0] }
    const contents = selected ? <div className='detailPropertyContent'>
        <div>{captions.name}</div><input value={selected.model.name} onChange={e => { selected.model.name = e.target.value }} />
        <div>{captions.length}</div><div>{selected.model.length}</div>
        <div>{captions.width}</div><div>{selected.model.width}</div>
        <div>{captions.fixed}</div><CheckBox value={selected.state.fixed} onChange={(value) => { appActions.setPanelState({fixed: value})}} />
    </div> : captions.noselected
    return <ToolBar caption={captions.title}>
        {contents}
    </ToolBar>
}
