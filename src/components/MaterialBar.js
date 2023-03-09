import React from 'react';
import { useSelector } from 'react-redux';
import useActions from '../customHooks/useActions';
import ComboBox from './ComboBox';
import ToolBar from './ToolBar';

export default function MaterialBar({ disabled }) {
    const materials = useSelector(store => store.materials)
    const captions = useSelector(store => store.captions.toolbars.materials)
    const appActions = useActions()
    const activeDSPColor = materials.DSPColors[materials.activeDSPColorIndex]
    return <ToolBar caption={captions.title}>
        <div className='gridContent'>
           
            <ComboBox title={captions.DSPColor} value={activeDSPColor} items={materials.DSPColors} onChange={(index)=>appActions.setMaterial({activeDSPColorIndex: index})}/>

        </div>
    </ToolBar>
}
