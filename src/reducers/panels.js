
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
                if (target.rect.x + 16 < source.rect.x) source.parallelFromBack.push(target)
                if (target.rect.x > source.rect.x + 16) source.parallelFromFront.push(target)
            } else {
                if (target.rect.y + 16 < source.rect.y) source.parallelFromBack.push(target)
                if (target.rect.y > source.rect.y + 16) source.parallelFromFront.push(target)
            }
        }
}


