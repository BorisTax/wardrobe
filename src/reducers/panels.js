
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

export function selectAllJointedPanels(panel, selectedPanels){
    panel.jointFromBackSide.forEach(j => {
        selectedPanels.add(j)
        selectAllJointedPanels(j, selectedPanels)
    })
    panel.jointFromFrontSide.forEach(j => {
        selectedPanels.add(j)
        selectAllJointedPanels(j, selectedPanels)
    })
}

export function deleteAllLinksToPanels(panels, panelsToDelete){
    for(let p of panels){
        panelsToDelete.forEach(d => {
            p.jointFromBackSide.delete(d)
            p.jointFromFrontSide.delete(d)
            p.parallelFromBack.delete(d)
            p.parallelFromFront.delete(d)
        })
    }
}

export function getWardrobeDimensions({panels}) {
    let maxX = 0
    let maxY = 0
    for (let p of panels) {
        if (p.vertical) {
            maxX = p.rect.last.x > maxX ? p.rect.last.x : maxX
        }else maxY = p.rect.last.y > maxY ? p.rect.last.y : maxY
    }
    return {maxX, maxY}
}
export function setWardrobeDimensions(appData, appActions) {
    const {maxX, maxY} = getWardrobeDimensions(appData)
    appActions.setWardrobeDimensions({width: maxX, height: maxY})
}

