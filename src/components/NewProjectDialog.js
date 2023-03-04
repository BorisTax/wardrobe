import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import useActions from '../customHooks/useActions';
import InputField from './InputField';
import { PropertyTypes } from './shapes/PropertyData';
import Modal from './Modal';
import ComboBox from './ComboBox';
const { NUMBER } = PropertyTypes

export default function NewProjectDialog() {
    const appActions = useActions()
    const captions = useSelector(store => store.captions)
    const wardrobeCaps = captions.toolbars.project.wardrobe
    const [{ width, depth, height, double }, setWardrobe] = useState({ width: 2400, depth: 600, height: 2400, double: false })
    const comboValue = double ? wardrobeCaps.type.double : wardrobeCaps.type.single
    return <Modal>
                <div style={{ maxWidth: "400px", wordWrap: "break-word", textAlign: "center" }}>{captions.toolbars.project.new}</div>
                <div className="newproject-content">
                    <div>{wardrobeCaps.width}</div>
                    <InputField type={NUMBER} value={width} setValue={value => setWardrobe(prev => ({ ...prev, width: +value }))} />
                    <div>{wardrobeCaps.depth}</div>
                    <InputField type={NUMBER} value={depth} setValue={value => setWardrobe(prev => ({ ...prev, depth: +value }))} />
                    <div>{wardrobeCaps.height}</div>
                    <InputField type={NUMBER} value={height} setValue={value => setWardrobe(prev => ({ ...prev, height: +value }))} />
                    <ComboBox title={wardrobeCaps.type.type} items={[wardrobeCaps.type.single, wardrobeCaps.type.double]} value={comboValue} onChange = {(index)=>setWardrobe(prev => ({ ...prev, double: !!index }))}/>
                </div>
                <div className='flex-center'>
                    <button onClick={() => appActions.newProject({ wardrobe: { width, depth, height, double } })}>{"OK"}</button>
                    <button onClick={() => appActions.showDialog(false)}>{captions.buttons.cancel}</button>
                </div>
            </Modal>

}