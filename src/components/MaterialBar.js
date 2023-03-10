import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useActions from '../customHooks/useActions';
import ComboBox from './ComboBox';
import ToolBar from './ToolBar';

export default function MaterialBar({ disabled }) {
    const materials = useSelector(store => store.materials)
    const captions = useSelector(store => store.captions.toolbars.materials)
    const appActions = useActions()
    const DSPColors = materials.DSPColors.map(c => c.name)
    const activeDSPColor = DSPColors[materials.activeDSPColorIndex]
    useEffect(()=>{
        fetch('/materials',
        {
            method: 'POST', headers: { "Content-Type": "application/json" },
            //body: JSON.stringify({ name, password })
        })
        .then(res =>
            res.json())
        .then(res => {
                appActions.setLoadedMaterials(res);
        })
        .catch(e => { console.error(e);});
    }, [])
    return <ToolBar caption={captions.title}>
        <div className='gridContent'>
           
            <ComboBox title={captions.DSPColor} value={activeDSPColor} items={DSPColors} onChange={(index)=>appActions.setMaterial({activeDSPColorIndex: index})}/>

        </div>
    </ToolBar>
}
