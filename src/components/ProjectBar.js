import React from 'react';
import { useSelector} from 'react-redux';
import useActions from '../customHooks/useActions';
import ToolButton from './ToolButton';
import ToolButtonBar from './ToolButtonBar';

export default function ProjectBar({disabled}){
    const appActions = useActions()
    const activated = useSelector(store => store.user.activated)
    const captions = useSelector(store => store.captions.toolbars.project)
    const disabledAll = !activated||disabled
    const disTitle = activated?"":captions.disabled
    return <>
        <ToolButtonBar>
            <ToolButton icon="new" title={captions.new} onClick={()=>{appActions.newProjectConfirm()}} disabled={disabled}/>
            <ToolButton icon="open" title={captions.open + disTitle} onClick={()=>{appActions.open()}} disabled={disabledAll}/>
            <ToolButton icon="save" title={captions.save + disTitle} onClick={()=>{appActions.save()}} disabled={false}/>
            </ToolButtonBar>
        </>
}
