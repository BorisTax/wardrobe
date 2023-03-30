import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import useActions from '../customHooks/useActions';
import InputField from './InputField';
import { PropertyTypes } from './shapes/PropertyData';
import Modal from './Modal';
import ComboBox from './ComboBox';
import { getFasadBases } from '../reducers/materialReducer';
const { INTEGER_POSITIVE_NUMBER } = PropertyTypes

export default function NewProjectDialog({start = false}) {
    const appActions = useActions()
    const appData = useSelector(store => store)
    const wardrobeCaps = appData.captions.toolbars.project.wardrobe
    const materialCaps = appData.captions.toolbars.info.materials 
    const dspColors = appData.materials.DSP.map(m => m.name)
    const fasadeBases = getFasadBases()
    const fasadeBasesCaps = fasadeBases.map(b => appData.captions.toolbars.info.materials.fasadBases[b])
    
    const [{ width, depth, height, double, fasadeCount, dspCorpus, fasadeBaseIndex, fasadeBaseColorIndex }, setState] = useState({ width: 2400, depth: 600, height: 2400, double: false, fasadeCount: 2, dspCorpus: dspColors[0], fasadeBaseIndex: 0, fasadeBaseColorIndex: 0 })
    const fasadeBaseColors = appData.materials[fasadeBases[fasadeBaseIndex]].map(m => m.name)
    const typeValue = double ? wardrobeCaps.type.double : wardrobeCaps.type.single
    return <Modal header={appData.captions.toolbars.project.new}>
                
                <div className="newproject-content">
                    <div>{wardrobeCaps.width}</div>
                    <InputField type={INTEGER_POSITIVE_NUMBER} value={width} max={5000} min={900} setValue={value => setState(prev => ({ ...prev, width: +value }))} />
                    <div>{wardrobeCaps.depth}</div>
                    <InputField type={INTEGER_POSITIVE_NUMBER} value={depth} max={700} min={400} setValue={value => setState(prev => ({ ...prev, depth: +value }))} />
                    <div>{wardrobeCaps.height}</div>
                    <InputField type={INTEGER_POSITIVE_NUMBER} value={height} max={3000} min={2000} setValue={value => setState(prev => ({ ...prev, height: +value }))} />
                    <ComboBox title={wardrobeCaps.type.type} items={[wardrobeCaps.type.single, wardrobeCaps.type.double]} value={typeValue} onChange = {(index)=>setState(prev => ({ ...prev, double: !!index }))}/>
                    <ComboBox title={wardrobeCaps.fasadeCount} items={[2, 3, 4]} value={fasadeCount} onChange = {(_, value)=>setState(prev => ({ ...prev, fasadeCount: +value}))}/>
                    <ComboBox title={materialCaps.dspMainColor} items={dspColors} value={dspCorpus} onChange = {(_, value)=>setState(prev => ({ ...prev, dspCorpus: value}))}/>
                    <ComboBox title={materialCaps.fasadBase} items={fasadeBasesCaps} value={fasadeBasesCaps[fasadeBaseIndex]} onChange = {(index)=>setState(prev => ({ ...prev, fasadeBaseIndex: index}))}/>
                    <ComboBox title={materialCaps.fasadBaseColor} items={fasadeBaseColors} value={fasadeBaseColors[fasadeBaseColorIndex]} onChange = {(index)=>setState(prev => ({ ...prev, fasadeBaseColorIndex: index}))}/>
                </div>
                <div className='flex-center'>
                    <button onClick={() => appActions.newProject({ wardrobe: { width, depth, height, double, fasadeCount, dspCorpus, fasadeBase: fasadeBases[fasadeBaseIndex], fasadeBaseColor: fasadeBaseColors[fasadeBaseColorIndex] } })}>{"OK"}</button>
                    {start ? <></> : <button onClick={() => appActions.showDialog(false)}>{appData.captions.buttons.cancel}</button>}
                </div>
            </Modal>

}