import React from 'react';
import { useSelector } from 'react-redux';
import useActions from '../customHooks/useActions';
import { WORKSPACE } from '../reducers/initialState';
import ComboBox from './ComboBox';

export default function WorkspaceBar(){
    const appActions = useActions()
    const appData = useSelector(store => store)
    const captions = appData.captions.toolbars.workspace
    const items = [captions.corpus, captions.fasades]
    const spaces = [WORKSPACE.CORPUS, WORKSPACE.FASADES]
    const selected = appData.workspace === WORKSPACE.CORPUS ? items[0] : items[1]
    return <>
            <ComboBox items={items} value = {selected} onChange = {(index) => appActions.setWorkspace(spaces[index])}/>
        </>
}