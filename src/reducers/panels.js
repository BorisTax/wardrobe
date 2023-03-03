import Shape from "../components/shapes/Shape";

export function isPanelIntersect(source, target) {
    let d
    if (source.vertical)
        d = Math.max(source.rect.y + source.model.length, target.rect.y + target.model.length) -
            Math.min(source.rect.y, target.rect.y);
    else d = Math.max(source.rect.x + source.model.length, target.rect.x + target.model.length) -
        Math.min(source.rect.x, target.rect.x)
    return d > (source.model.length + target.model.length)
}

export function updateParallelPanels(panels) {
    for (let source of panels)
        for (let target of panels) {
            if (source === target) continue
            if (!(source.vertical === target.vertical)) continue
            if (isPanelIntersect(source, target)) continue
            if (source.vertical) {
                if (target.rect.x + target.thickness <= source.rect.x) source.parallelFromBack.add(target)
                if (target.rect.x >= source.rect.x + source.thickness) source.parallelFromFront.add(target)
            } else {
                if (target.rect.y + target.thickness <= source.rect.y) source.parallelFromBack.add(target)
                if (target.rect.y >= source.rect.y + source.thickness) source.parallelFromFront.add(target)
            }
        }
}

export function selectAllJointedPanels(panel, selectedPanels) {
    panel.jointFromBackSide.forEach(j => {
        selectedPanels.add(j)
        selectAllJointedPanels(j, selectedPanels)
    })
    panel.jointFromFrontSide.forEach(j => {
        selectedPanels.add(j)
        selectAllJointedPanels(j, selectedPanels)
    })
}

export function deleteAllLinksToPanels(panels, panelsToDelete) {
    for (let p of panels) {
        panelsToDelete.forEach(d => {
            p.jointFromBackSide.delete(d)
            p.jointFromFrontSide.delete(d)
            p.parallelFromBack.delete(d)
            p.parallelFromFront.delete(d)
        })
    }
}

export function getSelectionData(selected) {
    let panels = []
    let dimensions = []
    let fixDisabled = false
    let deleteDisabled = false
    for (let s of selected) {
        if (!s.state.deleteable) deleteDisabled = true
        if (!s.state.fixable) fixDisabled = true
        if (s.type === Shape.PANEL || s.type === Shape.DRAWER) panels.push(s)
        if (s.type === Shape.DIMENSION) { dimensions.push(s) }
    }

    if (panels.length + dimensions.length === 0) {
        fixDisabled = true
        deleteDisabled = true
    }
    const isJoints = panels.find(p => p.jointFromBackSide.size > 0 || p.jointFromFrontSide.size > 0)
    return { canBeDeleted: !deleteDisabled, canBeFixed: !fixDisabled, panelCount: panels.length, firstSelected: panels[0], dimensionCount: dimensions.length, isJoints }
}

export function moveSelectedPanels(dx, dy, active, selected, onGabaritChange = () => { }) {
    const vertical = active.vertical
    if ((dx === 0 && vertical) || (dy === 0 && !vertical)) return
    const panels = Array.from(selected).filter(s => (s.vertical === vertical) && s.type !== Shape.DIMENSION)
    if (vertical) {
        panels.sort((p1, p2) => dx < 0 ? p1.rect.x - p2.rect.x : p2.rect.x - p1.rect.x)
    } else panels.sort((p1, p2) => dy < 0 ? p1.rect.y - p2.rect.y : p2.rect.y - p1.rect.y)
    let canMove = true
    const savedPanels = new Set()
    for (let p of panels) {
        p.save()
        savedPanels.add(p)
        const res = p.moveTo(dx, dy, onGabaritChange)
        if (!res.result || (p.vertical && (res.newDX === 0)) || (!p.vertical && (res.newDY === 0))) { canMove = false; break;}
    }
    if (!canMove) {
        for (let p of savedPanels) {
            p.restore()
        }
        onGabaritChange()
    }

}

export function getWardrobeDimensions({ panels }) {
    let maxX = 0
    let maxY = 0
    for (let p of panels) {
        if (p.vertical) {
            maxX = p.rect.last.x > maxX ? p.rect.last.x : maxX
        } else maxY = p.rect.last.y > maxY ? p.rect.last.y : maxY
    }
    return { maxX, maxY }
}
export function setWardrobeDimensions(appData, appActions) {
    const { maxX, maxY } = getWardrobeDimensions(appData)
    appActions.setWardrobeDimensions({ width: maxX, height: maxY })
}

