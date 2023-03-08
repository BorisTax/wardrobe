import Shape from "../components/shapes/Shape";

export function isPanelIntersect(source, target) {
  let d;
  if (source.vertical)
    d = Math.max(source.rect.last.y, target.rect.last.y) - Math.min(source.rect.y, target.rect.y);
  else
    d = Math.max(source.rect.last.x, target.rect.last.x) - Math.min(source.rect.x, target.rect.x);
  return d <= source.length + target.length;
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
  for (let d of appData.dimensions) {
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