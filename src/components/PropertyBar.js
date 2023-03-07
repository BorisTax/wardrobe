import React from 'react';
import ToolBar from './ToolBar';
import ToolButton from './ToolButton';
import InputField from './InputField'
import ToolButtonBar from './ToolButtonBar';
import { useSelector } from 'react-redux';
import useActions from '../customHooks/useActions';
import { PropertyTypes } from './shapes/PropertyData';
import Shape from './shapes/Shape';

export default function PropertyBar() {
  const captions = useSelector(store => store.captions.toolbars.property)
  const appActions = useActions()
  const selected = Array.from(useSelector(store => store.selectedPanels))
  const selectedPanels = selected.filter(p => p.type !== Shape.DIMENSION)
  const selectedCount = selected.length
  const isJoints = selectedPanels.find(p => p.jointFromBackSide.size > 0 || p.jointFromFrontSide.size > 0);
  const fixed_move = selected.some(s => s.state.fixed_move)
  const noFix = selected.some(s => !s.state.fixable)
  const noDelete = selected.some(s => !s.state.deletable)
  const fixedLengthMin = selectedPanels.some(s => s.state.fixedLength.min)
  const fixedLengthMax = selectedPanels.some(s => s.state.fixedLength.max)
  let contents = <></>
  if (selectedCount === 1) {
    contents = <div className='detailPropertyContent'>
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
      <ToolButton title={fixed_move ? captions.unlock_move : captions.lock_move} disabled={noFix} pressed={fixed_move} pressedStyle={"lockmovebutton_pressed"} unpressedStyle={"lockmovebutton_unpressed"} onClick={() => { appActions.setPanelState({ fixed_move: !fixed_move }) }} />
      <ToolButton title={fixedLengthMin ? captions.unlock_minlength : captions.lock_minlength} disabled={noFix} pressed={fixedLengthMin} pressedStyle={"lockminlengthbutton_pressed"} unpressedStyle={"lockminlengthbutton_unpressed"} onClick={() => { appActions.fixLength(!fixedLengthMin, fixedLengthMax) }} />
      <ToolButton title={fixedLengthMax ? captions.unlock_maxlength : captions.lock_maxlength} disabled={noFix} pressed={fixedLengthMax} pressedStyle={"lockmaxlengthbutton_pressed"} unpressedStyle={"lockmaxlengthbutton_unpressed"} onClick={() => { appActions.fixLength(fixedLengthMin, !fixedLengthMax) }} />
      <ToolButton title={captions.delete} disabled={noDelete} pressedStyle={"deletebutton"} unpressedStyle={"deletebutton"} onClick={() => { appActions.deleteSelectedConfirm({ isJoints }) }} />
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
  if (p.editable) {
    switch (p.type) {
      case PropertyTypes.STRING: return <input value={p.value} onChange={(e) => { p.setValue(e.target.value); updateState() }} />
      case PropertyTypes.INTEGER_POSITIVE_NUMBER: return <InputField type={p.type} value={p.value} setValue={(value) => { p.setValue(value); updateState() }} />
      default:
    }
  } else {
    return <div>{p.value}</div>;
  }
}