import React from 'react';
import { useSelector } from 'react-redux';
import useActions from '../customHooks/useActions';
import ComboBox from './ComboBox';

export default function MaterialBar({ disabled }) {
    const materials = useSelector(store => store.materials)
    const captions = useSelector(store => store.captions.toolbars.info.materials)
    const appActions = useActions()
    const DSPColors = materials.DSP.map(c => c.name)
    const activeDSPColor = materials.activeDSPColor
    return <div className='gridContent'>
           
            <ComboBox title={captions.dspMainColor} value={activeDSPColor} items={DSPColors} onChange={(_, value)=>appActions.setMaterial({activeDSPColor: value})}/>

        </div>
}