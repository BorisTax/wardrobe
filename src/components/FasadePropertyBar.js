import React from 'react';
import ToolBar from './ToolBar';
import ToolButton from './ToolButton';
import InputField from './InputField'
import ToolButtonBar from './ToolButtonBar';
import CheckBox from './CheckBox'; 
import { useSelector } from 'react-redux';
import useActions from '../customHooks/useActions';
import { PropertyTypes } from './shapes/PropertyData';
import Shape from './shapes/Shape';

export default function FasadePropertyBar() {
  const captions = useSelector(store => store.captions.toolbars.property)
  const appActions = useActions()
  const selected = Array.from(useSelector(store => store).selectedPanels)
  const selectedPanels = selected.filter(p => p.type !== Shape.DIMENSION)
  const levelUpEnabled = selectedPanels.length === 1 && selectedPanels[0].parent
  const selectedCount = selected.length
  const noDelete = selected.some(s => !s.state.deletable)
  let contents = <></>
  if (selectedCount === 1) {
    contents = <div className='propertyContent'>
      {getProperties(selected[0], captions, appActions.updateState)}
    </div>
  }
  let noSelected = false
  if (selectedCount === 0) {
    contents = captions.noselected
    noSelected = true
  }
  if (selectedCount > 1) contents = captions.selected + selectedCount
  const buttons = !noSelected ? <div>
    <hr />
    <ToolButtonBar>
      <ToolButton title={captions.delete} disabled={noDelete} pressedStyle={"deletebutton"} unpressedStyle={"deletebutton"} onClick={() => { appActions.deleteSelectedFasadesConfirm() }} />
      <ToolButton title={captions.levelup} disabled={!levelUpEnabled} pressedStyle={"levelUpButton"} unpressedStyle={"levelUpButton"} onClick={() => { appActions.selectParent(selectedPanels[0]) }} />
    </ToolButtonBar>
  </div> : <></>
  return <ToolBar caption={captions.title}>
    {contents}
    {buttons}
  </ToolBar>
}

function getProperties(object, captions, updateState) {
  const props = [];
  for (let p of object.getProperties()) {
    if(p.hidden) continue
    const value = getValueElement(p, updateState);
    const prop = (
      <>
        <div>{captions[p.key]}</div>
        {value}
      </>
    );
    props.push(prop);
  }
  return props
}

function getValueElement(p, updateState) {
  if (p.editable()) {
    switch (p.type) {
      case PropertyTypes.STRING: return <InputField type={p.type} value={p.value} setValue={(value) => { p.setValue(value); updateState() }} />
      case PropertyTypes.INTEGER_POSITIVE_NUMBER: return <div><InputField type={p.type} value={p.value} setValue={(value) => { p.setValue(value); updateState() }} />{(p.extra && p.extra())? <span>{p.extra()}</span> : <></>}</div>
      case PropertyTypes.BOOL: return <CheckBox value={p.value} onChange={(value) => { p.setValue(value); updateState() }} />
      default:
    }
  } else {
    return <div>{p.value + (p.extra ? p.extra() : "")}</div>;
  }
}