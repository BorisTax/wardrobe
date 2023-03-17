import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import useActions from '../customHooks/useActions';
import InputField from './InputField';
import { PropertyTypes } from './shapes/PropertyData';
import Modal from './Modal';
import ComboBox from './ComboBox';
const { INTEGER_POSITIVE_NUMBER } = PropertyTypes

export default function NewProjectDialog({start = false}) {
    const appActions = useActions()
    const captions = useSelector(store => store.captions)
    const wardrobeCaps = captions.toolbars.project.wardrobe
    const [{ width, depth, height, double, fasadeCount }, setWardrobe] = useState({ width: 2400, depth: 600, height: 2400, double: false, fasadeCount: 2 })
    const typeValue = double ? wardrobeCaps.type.double : wardrobeCaps.type.single
    return <Modal header={captions.toolbars.project.new}>
                
                <div className="newproject-content">
                    <div>{wardrobeCaps.width}</div>
                    <InputField type={INTEGER_POSITIVE_NUMBER} value={width} max={5000} min={900} setValue={value => setWardrobe(prev => ({ ...prev, width: +value }))} />
                    <div>{wardrobeCaps.depth}</div>
                    <InputField type={INTEGER_POSITIVE_NUMBER} value={depth} max={700} min={400} setValue={value => setWardrobe(prev => ({ ...prev, depth: +value }))} />
                    <div>{wardrobeCaps.height}</div>
                    <InputField type={INTEGER_POSITIVE_NUMBER} value={height} max={3000} min={2000} setValue={value => setWardrobe(prev => ({ ...prev, height: +value }))} />
                    <ComboBox title={wardrobeCaps.type.type} items={[wardrobeCaps.type.single, wardrobeCaps.type.double]} value={typeValue} onChange = {(index)=>setWardrobe(prev => ({ ...prev, double: !!index }))}/>
                    <ComboBox title={wardrobeCaps.fasadeCount} items={[2, 3, 4]} value={fasadeCount} onChange = {(_, value)=>setWardrobe(prev => ({ ...prev, fasadeCount: +value}))}/>
                </div>
                <div className='flex-center'>
                    <button onClick={() => appActions.newProject({ wardrobe: { width, depth, height, double, fasadeCount } })}>{"OK"}</button>
                    {start ? <></> : <button onClick={() => appActions.showDialog(false)}>{captions.buttons.cancel}</button>}
                </div>
            </Modal>

}