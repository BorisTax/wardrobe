import React from 'react';
import { useSelector } from 'react-redux';
import ToolBar from './ToolBar';
import ToolButton from './ToolButton';
import Counter from './Counter';
import PageLister from './PageLister';
import ToolButtonRow from './ToolButtonRow';
import useActions from '../customHooks/useActions';

export default function TablesBar(props) {
    const appData = useSelector(store => store)
    const captions = useSelector(store => store.captions.toolbars.tables)
    const appActions = useActions()
    const tables = appData.tables;
    const activeTable = appData.activeTable;
    const complectCount = appData.tables[activeTable].model.multiply;
    const deleteConfirm = useSelector(store => store.deleteRowConfirm)
    return <ToolBar caption={captions.title}>
        <div style={{ display: "flex", alignItems: "center" }}>
            <PageLister current={activeTable} count={tables.length} setCurrent={(value) => { appActions.setActiveTable(value) }} />
            <ToolButtonRow>
                <ToolButton icon="add" title={captions.add} disabled={props.disabled} onClick={() => { appActions.addTable() }} />
                <ToolButton icon="delete" title={captions.delete} disabled={!((tables.length > 1) && !props.disabled)} onClick={() => { deleteConfirm ? appActions.deleteTableConfirm() : appActions.deleteActiveTable() }} />
            </ToolButtonRow>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
            <span>{captions.complect}</span>
            <Counter disabled={props.disabled} value={complectCount} min={1} max={100} setValue={(value) => { appActions.setComplectCount(value) }} />
        </div>
        <ToolButtonRow>
            <ToolButton icon={"table_move_to"} title={captions.goto} disabled={props.disabled} onClick={() => { appActions.goToActiveTable(); }} />
            <ToolButton icon={"table_hor_center"} title={captions.alignHor} disabled={props.disabled} onClick={() => { appActions.arrangePanels({ hor: true }) }} />
            <ToolButton icon={"table_vert_center"} title={captions.alignVert} disabled={props.disabled} onClick={() => { appActions.arrangePanels({ vert: true }) }} />
        </ToolButtonRow>
    </ToolBar>

}