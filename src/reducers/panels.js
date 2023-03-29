import FasadeShape from "../components/shapes/FasadeShape";
import Shape from "../components/shapes/Shape";
import { WORKSPACE } from "./initialState";
import { FasadBase } from "./materialReducer";

export class SelectionSet extends Set{
    add(item){
      const res = super.add(item)
      if(item && item.onAddToSelection) item.onAddToSelection(res)
      return res 
    }
    delete(item){
      const res = super.delete(item)
      if(item && item.onDeleteFromSelection) item.onDeleteFromSelection(res)
      return res
    }
    has(item){
      return super.has(item)
    }
    clear(){
      for(let p of this) if(p.onDeleteFromSelection) p.onDeleteFromSelection()
      return super.clear()
    }
}

export function isPointInPanelArea(point, panel) {
  let d;
  if (panel.vertical)
    d = (point.y - panel.rect.last.y) * (point.y - panel.rect.y);
  else
    d = (point.x - panel.rect.last.x) * (point.x - panel.rect.x);
  return d <= 0;
}

export function isPanelIntersect(source, target) {
  let d;
  if (source.vertical)
    d = Math.max(source.rect.last.y, target.rect.last.y) - Math.min(source.rect.y, target.rect.y);
  else
    d = Math.max(source.rect.last.x, target.rect.last.x) - Math.min(source.rect.x, target.rect.x);
  return d <= source.length + target.length;
}

export function canBeDistributed(selected) {
  let panels = Array.from(selected)
  if(panels.some(p => (p.type !== Shape.PANEL)
    || (p.jointFromBackSide.size !== 0)
    || (p.jointFromFrontSide.size !== 0)
    || (p.state.fixed_move === true))
    ) return false

  if (!panels.every(p => p.vertical) && !panels.every(p => !p.vertical)) return false
  if (panels.length === 0) return false
  const jointBack = panels[0].jointToBack
  const jointFront = panels[0].jointToFront
  if (!panels.every(p => p.jointToBack === jointBack)) return false
  if (!panels.every(p => p.jointToFront === jointFront)) return false
  if (panels[0].vertical)
    panels.sort((p1, p2) => p1.rect.x - p2.rect.x);
  else
    panels.sort((p1, p2) => p1.rect.y - p2.rect.y);
  for (let i = 0; i < panels.length - 1; i++) {
    if (panels[i].getNearest().nearestFromFront !== panels[i + 1]) return false
  }
  return true
}

export function distribute(selected){
  const panels = Array.from(selected)

  if (panels[0].vertical){
    panels.sort((p1, p2) => p1.rect.x - p2.rect.x);
    panels.forEach(p => p.moveTo(-10000, 0))
    const d = Math.round((panels.at(-1).getNearest().nearestFromFront.rect.x - panels.at(-1).rect.last.x) / (panels.length + 1))
    for(let i = panels.length - 1; i >= 0; i--) panels[i].moveTo(d * (i + 1), 0)
  }
  else{
    panels.sort((p1, p2) => p1.rect.y - p2.rect.y);
    panels.forEach(p => p.moveTo(0, -10000))
    const d = Math.round((panels.at(-1).getNearest().nearestFromFront.rect.y - panels.at(-1).rect.last.y) / (panels.length + 1))
    for(let i = panels.length - 1; i >= 0; i--) panels[i].moveTo(0, d * (i + 1))
  }

}

export function divideFasadesHor(fasades, count){
  const newFasades = new Set()
  for(let f of fasades){
    if (f.level > 2) continue
    f.divided = FasadeShape.HOR
    const profile = f.base === FasadBase.DSP ? 1 : 3
    const partLen = Math.round((f.height - profile * (count - 1)) / count )
    let total = 0
    let pos = f.getPosition()
    let options = {
      width: f.width, 
      level: f.level + 1, 
      parent: f, 
      base: f.base, 
      baseColor: f.baseColor,
      name: "Элемент фасада",
      position: {x: pos.x, y: pos.y}
    }
    for(let i = 1; i < count; i++){
      options.height = partLen
      let fasade = new FasadeShape(options)
      newFasades.add(fasade)
      f.children.push(fasade)
      total += (partLen + profile)
      options.position.y = pos.y + total
      
    }
    options.height = f.height - total
    options.position.y = pos.y + total
    let fasade = new FasadeShape(options)
    newFasades.add(fasade)
    f.children.push(fasade)
    
    f.state.selectable = false
  }
  return newFasades
}

export function divideFasadesVert(fasades, count){
  const newFasades = new Set()
  for(let f of fasades){
    if (f.level > 2) continue
    f.divided = FasadeShape.VERT
    const profile = f.base === FasadBase.DSP ? 1 : 3
    const partWidth = Math.round((f.width - profile * (count - 1)) / count )
    let total = 0
    let pos = f.getPosition()
    let options = {
      height: f.height, 
      level: f.level + 1, 
      parent: f, 
      base: f.base, 
      baseColor: f.baseColor,
      name: "Элемент фасада",
      position: {x: pos.x, y: pos.y}
    }
    for(let i = 1; i < count; i++){
      options.width = partWidth
      let fasade = new FasadeShape(options)
      newFasades.add(fasade)
      f.children.push(fasade)
      total += (partWidth + profile)
      options.position.x = pos.x + total
      
    }
    options.width = f.width - total
    options.position.x = pos.x + total
    let fasade = new FasadeShape(options)
    newFasades.add(fasade)
    f.children.push(fasade)
    
    f.state.selectable = false
  }
  return newFasades
}

export function getProfile(base1, base2){
  if(base1 === FasadBase.DSP && base2 === FasadBase.DSP) return 1
  return 3
  //if(type1 !== type2) return 3
  //if(type1 === FasadBase.GLASS && type2 === FasadBase.GLASS) return 3
}

export function selectAllChildrenFasades(selected){
  function selectChildren(parent){
    const children = new Set()
    for(let c of parent.children){
      if (c.hasChildren()) {
        selectChildren(c).forEach(child => children.add(child))
        c.children = []
        c.state.selectable = true
      }
      else children.add(c)
    }
    children.add(parent)
    return children
  }
  const allSelected = new Set()
  for(let s of selected){
    if(s.type !== Shape.FASADE) continue
    for(let c of s.parent.children)
      if (c.hasChildren()) {
        selectChildren(c).forEach(child => allSelected.add(child));
        c.children = []
        c.state.selectable = true
      }
        else allSelected.add(c)
    s.parent.children = []
    s.parent.state.selectable = true
  }
  return allSelected
}

export function bringSelectedToFront(fasades, selected){
  const newFasades = [...fasades]
  newFasades.sort((f1, f2) => !selected.has(f2) ? 1 : -1)
  return new Set(newFasades)
}


export function updateParallelPanels(panels) {
  for (let source of panels)
    for (let target of panels) {
      if (source === target) continue;
      if (!(source.vertical === target.vertical)) continue;
      if (!isPanelIntersect(source, target)) continue;
      if (source.vertical) {
        if (target.rect.x + target.thickness <= source.rect.x)
          source.parallelFromBack.add(target);
        if (target.rect.x >= source.rect.x + source.thickness)
          source.parallelFromFront.add(target);
      } else {
        if (target.rect.y + target.thickness <= source.rect.y)
          source.parallelFromBack.add(target);
        if (target.rect.y >= source.rect.y + source.thickness)
          source.parallelFromFront.add(target);
      }
    }
}

export function getJointData(p) {
  const jointFromBackSide = Array.from(p.jointFromBackSide);
  const jointFromFrontSide = Array.from(p.jointFromFrontSide);
  const jointsFromBackMinToMax = jointFromBackSide.sort((j1, j2) => j1.getLength() - j2.getLength())
  const jointsFromFrontMinToMax = jointFromFrontSide.sort((j1, j2) => j1.getLength() - j2.getLength())
  return { jointsFromBackMinToMax, jointsFromFrontMinToMax };
}

export function selectAllJointedPanels(panel, selectedPanels) {
  panel.jointFromBackSide.forEach((j) => {
    selectedPanels.add(j);
    selectAllJointedPanels(j, selectedPanels);
  });
  panel.jointFromFrontSide.forEach((j) => {
    selectedPanels.add(j);
    selectAllJointedPanels(j, selectedPanels);
  });
}

export function deleteAllLinksToPanels(panels, panelsToDelete) {
  for (let p of panels) {
    panelsToDelete.forEach((d) => {
      p.jointFromBackSide.delete(d);
      p.jointFromFrontSide.delete(d);
      p.parallelFromBack.delete(d);
      p.parallelFromFront.delete(d);
    });
  }
}

export function getSelectionData(selected) {
  let panels = [];
  let dimensions = [];
  let fixDisabled = false;
  let deleteDisabled = false;
  for (let s of selected) {
    if (!s.state.deletable) deleteDisabled = true;
    if (!s.state.fixable) fixDisabled = true;
    if (s.type === Shape.PANEL || s.type === Shape.DRAWER) panels.push(s);
    if (s.type === Shape.DIMENSION) {
      dimensions.push(s);
    }
  }

  if (panels.length + dimensions.length === 0) {
    fixDisabled = true;
    deleteDisabled = true;
  }
  const isJoints = panels.find(
    (p) => p.jointFromBackSide.size > 0 || p.jointFromFrontSide.size > 0
  );
  return {
    canBeDeleted: !deleteDisabled,
    canBeFixed: !fixDisabled,
    panelCount: panels.length,
    firstSelected: panels[0],
    dimensionCount: dimensions.length,
    isJoints,
  };
}

export function moveSelectedPanels(dx, dy, active, selected, onGabaritChange = () => { }) {
  const vertical = active.vertical;
  if ((dx === 0 && vertical) || (dy === 0 && !vertical)) return;
  const panels = Array.from(selected).filter((s) => s.vertical === vertical && s.type !== Shape.DIMENSION);
  if (vertical) {
    panels.sort((p1, p2) => dx < 0 ? p1.rect.x - p2.rect.x : p2.rect.x - p1.rect.x);
  } else
    panels.sort((p1, p2) => dy < 0 ? p1.rect.y - p2.rect.y : p2.rect.y - p1.rect.y);
  let maxDX = 1000000;
  let maxDY = 1000000;
  let prevPanel
  for (let p of panels) {
    const res = p.moveTo(dx, dy, onGabaritChange, true, prevPanel);
    if (vertical && Math.abs(res.newDX) < Math.abs(maxDX)) {
      maxDX = res.newDX;
    }
    if (!vertical && Math.abs(res.newDY) < Math.abs(maxDY)) {
      maxDY = res.newDY;
    }
    prevPanel = p
  }
  for (let p of panels) {
    p.moveTo(maxDX, maxDY, onGabaritChange);
  }
}

export function getWardrobeDimensions({ panels }) {
  let maxX = 0;
  let maxY = 0;
  for (let p of panels) {
    if (p.vertical) {
      maxX = p.rect.last.x > maxX ? p.rect.last.x : maxX;
    } else maxY = p.rect.last.y > maxY ? p.rect.last.y : maxY;
  }
  return { maxX, maxY };
}

export function setWardrobeDimensions(appData, appActions) {
  const { maxX, maxY } = getWardrobeDimensions(appData);
  appActions.setWardrobeDimensions({ width: maxX, height: maxY });
}

export function getWardrobePrintArea(appData) {
  const { width, height } = appData.wardrobe
  const rect = { topLeft: { x: 0, y: height }, bottomRight: { x: width, y: 0 } }
  const dimensions = appData.workspace === WORKSPACE.CORPUS ? appData.dimensions : appData.fasadeDimensions
  for (let d of dimensions) {
    const { x, y } = d.getPosition()
    if (d.vertical) {
      if (x < rect.topLeft.x) rect.topLeft.x = x
      if (x > rect.bottomRight.x) rect.bottomRight.x = x
    } else {
      if (y < rect.bottomRight.y) rect.bottomRight.y = y
      if (y > rect.topLeft.y) rect.topLeft.y = y
    }
  }
  rect.topLeft.x -= 150
  rect.topLeft.y += 150
  rect.bottomRight.x += 150
  rect.bottomRight.y -= 100
  return rect
}