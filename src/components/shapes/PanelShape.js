import Geometry, { Intersection } from '../../utils/geometry';
import Shape from "./Shape";
import ShapeStyle from './ShapeStyle';
import { Color } from '../colors';
import { isPanelIntersect } from '../../reducers/panels';
export default class PanelShape extends Shape {
    type = Shape.PANEL
    constructor(model) {
        super();
        this.model = { ...model };
        this.gabarit = model.gabarit //габаритная деталь
        this.model.width = model.gabarit ? model.wardrobe.depth : model.wardrobe.depth - 100
        this.panelMargin = model.panelMargin || 0
        if (!model.active) this.model.active = false
        this.vertical = model.vertical
        this.model.name = model.name || (this.vertical ? "Стойка" : "Полка")
        this.minLength = model.minLength || 282
        this.state.selectable = model.selectable === undefined ? true : model.selectable
        this.state.deleteable = model.deleteable === undefined ? true : model.deleteable
        this.state.fixable = model.fixable === undefined ? true : model.fixable
        this.state.fixed = model.fixed === undefined ? false : model.fixed
        this.state.blocked = model.blocked === undefined ? false : model.fixed
        this.state.hidden = model.hidden
        this.thickness = model.thickness || 16
        const position = model.position || { x: 0, y: 0 }
        const w = model.vertical ? this.thickness : model.length
        const h = model.vertical ? model.length : this.thickness
        const last = { x: position.x + w, y: position.y + h }
        this.rect = { ...position, last, w, h }
        this.setStyle(new ShapeStyle(Color.BLACK, ShapeStyle.SOLID));
        this.jointFromBackSide = model.jointFromBackSide || new Set()
        this.jointFromFrontSide = model.jointFromFrontSide || new Set()
        this.parallelFromBack = model.parallelFromBack || new Set()
        this.parallelFromFront = model.parallelFromFront || new Set()
        this.dimensions = new Set()
    }

    drawSelf(ctx, realRect, screenRect, print = false) {
        if (this.state.hidden) return
        super.drawSelf(ctx, realRect, screenRect)
        if (this.state.selected || this.state.highlighted) { this.getStyle().setWidth(2) } else { this.getStyle().setWidth(1) }
        const topLeft = Geometry.realToScreen(this.rect, realRect, screenRect);
        const bottomRight = Geometry.realToScreen(this.rect.last, realRect, screenRect);
        const width = bottomRight.x - topLeft.x
        const height = bottomRight.y - topLeft.y
        let x = Math.trunc(topLeft.x) + 0.5
        let y = Math.trunc(topLeft.y) + 0.5
        ctx.strokeRect(x, y, width, height);
    }
    refresh(realRect, screenRect) {
        if (this.vertical) {
            this.rect.height = this.model.length
            this.rect.width = this.thickness
        } else {
            this.rect.width = this.model.length
            this.rect.height = this.thickness
        }
        this.rect.last = { x: this.rect.x + this.rect.width, y: this.rect.y + this.rect.height }
    }
    setCaption() {
        const ext = this.model.listKey === 'secondary' ? "Доп " : ""
        const module = this.model.module && this.model.drawModule ? this.model.module : "";
        this.caption = ` ${ext}№${this.model.id} ${this.model.origLength}x${this.model.origWidth} ${module} `;
        this.captionShape.setText(this.caption);
    }
    setPosition(x, y) {
        this.rect.x = x
        this.rect.y = y
        this.rect.last = { x: x + this.rect.width, y: y + this.rect.height }
    }
    getPosition() {
        return this.rect
    }
    setHidden(hidden) {
        this.state.hidden = hidden
    }
    setLength(length) {
        this.model.length = length
        this.refresh()
    }
    getLength() {
        return this.model.length
    }
    getId() {
        return this.model.id;
    }
    setId(id) {
        this.model.id = id;
        this.refreshModel();
    }

    isUnderCursor(p, pixelRatio) {
        const mult = 2
        return (p.x >= this.rect.x - pixelRatio * mult) && (p.x <= this.rect.x + this.rect.width + pixelRatio * mult) && (p.y >= this.rect.y - pixelRatio * mult) && (p.y <= this.rect.y + this.rect.height + pixelRatio * mult);
    }
    getDistance(point) {

    }
    moveTo(dx, dy, onGabaritChange = () => { }) {
        const { x, y } = this.getPosition();
        if (this.vertical) dy = 0; else dx = 0
        let newX = x + dx
        let newY = y + dy
        let result
        ({ result, newX, newY, dx, dy } = this.isMoveAvailable({ newX, newY, dx, dy }))
        if (result) {
            this.setPosition(newX, newY);
            for (let joint of this.jointFromBackSide) {
                joint.setLength(joint.getLength() + (dx + dy))
            }
            for (let joint of this.jointFromFrontSide) {
                joint.setLength(joint.getLength() - (dx + dy))
                const jpos = joint.getPosition()
                joint.setPosition(jpos.x + dx, jpos.y + dy)
            }
            if (this.gabarit) onGabaritChange() //to recalculate wardrobe size
            return true
        } else return false
    }
    
    isMoveAvailable({ newX: x, newY: y, dx, dy }) {
        if (this.state.fixed) return { result: false }
        const resultNear = this.snapToNearest({ newX: x, newY: y, dx, dy })
        const resultJoint = this.snapToMinJointLength({ newX: x, newY: y, dx, dy })
        if (resultNear.result === true) {
            if (resultJoint.result === false) return { ...resultNear }
            if (this.vertical) {
                if (dx < 0) return resultNear.newX > resultJoint.newX ? { ...resultNear } : { ...resultJoint }
                return resultNear.newX < resultJoint.newX ? { ...resultNear } : { ...resultJoint }
            } else {
                if (dy < 0) return resultNear.newY > resultJoint.newY ? { ...resultNear } : { ...resultJoint }
                return resultNear.newY < resultJoint.newY ? { ...resultNear } : { ...resultJoint }
            }
        }
        if (resultJoint.result === true) return { ...resultJoint }
        return { result: true, newX: x, newY: y, dx, dy }
    }

    snapToMinJointLength({ newX: x, newY: y, dx, dy }) {
        const jointFromBackSide = Array.from(this.jointFromBackSide)
        const shortestJointFromBack = jointFromBackSide.reduce((min, j) => j.getLength() < min.getLength() ? j : min, jointFromBackSide[0])
        if(shortestJointFromBack){
            const delta = (shortestJointFromBack.getLength() + dx + dy) - shortestJointFromBack.minLength
            if (delta < 0)
                if (this.vertical) return { result: true, newX: x - delta, newY: y, dx: dx - delta, dy }
                    else return { result: true, newX: x, newY: y - delta, dx, dy: dy - delta }
            }
        const jointFromFrontSide = Array.from(this.jointFromFrontSide)
        const shortestJointFromFront = jointFromFrontSide.reduce((min, j) => j.getLength() < min.getLength() ? j : min, jointFromFrontSide[0])
        if(shortestJointFromFront){
            const delta = (shortestJointFromFront.getLength() - dx - dy) - shortestJointFromFront.minLength
            if (delta < 0) 
                if (this.vertical) return { result: true, newX: x + delta, newY: y, dx: dx + delta, dy }
                    else return { result: true, newX: x, newY: y + delta, dx, dy: dy + delta }
                }
        return { result: false, newX: x, newY: y, dx, dy }
    }

    snapToNearest({ newX: x, newY: y, dx, dy }) {
        const { nearestFromBack, nearestFromFront } = this.getNearest()
        let near = nearestFromBack
        if (near) {
            const margin = Math.max(this.panelMargin, near.panelMargin)
            if (this.vertical) {
                const minX = near.rect.x + near.thickness + margin
                const minDX = minX - x
                if (x < minX) return { result: true, newX: minX, newY: y, dx: dx + minDX, dy }
            } else {
                const minY = near.rect.y + near.thickness + margin
                const minDY = minY - y
                if (y < minY) return { result: true, newX: x, newY: minY, dx, dy: dy + minDY }
            }
        }
        near = nearestFromFront
        if (near) {
            const margin = Math.max(this.panelMargin, near.panelMargin)
            if (this.vertical) {
                const minX = near.rect.x - near.thickness - margin
                const minDX = x - minX
                if (minX < x) return { result: true, newX: minX, newY: y, dx: dx - minDX, dy }
            } else {
                const minY = near.rect.y - near.thickness - margin
                const minDY = y - minY
                if (minY < y) return { result: true, newX: x, newY: minY, dx, dy: dy - minDY }
            }
        }
        return { result: false, newX: x, newY: y, dx, dy }
    }

    getNearest() {
        let nearestFromBack = this.parallelFromBack.values().next().value
        let nearestFromFront = this.parallelFromFront.values().next().value
        let maxX = 0, maxY = 0
        for (let par of this.parallelFromBack) {
            if ((par.rect.x > maxX) && this.vertical) {
                nearestFromBack = par
                maxX = par.rect.x
            }
            if ((par.rect.y > maxY) && !this.vertical) {
                nearestFromBack = par
                maxY = par.rect.y
            }
        }
        maxX = 1000000
        maxY = 1000000
        for (let par of this.parallelFromFront) {
            if ((par.rect.x < maxX) && this.vertical) {
                nearestFromFront = par
                maxX = par.rect.x
            }
            if ((par.rect.y < maxY) && !this.vertical) {
                nearestFromFront = par
                maxY = par.rect.y
            }
        }
        return { nearestFromBack, nearestFromFront }
    }

    canBePlaced(x, y, panels, wardrobe) {
        if (x < this.thickness || x > wardrobe.width - this.thickness || y < 46 || y > wardrobe.height - this.thickness) return false
        this.parallelFromBack = new Set()
        this.parallelFromFront = new Set()
        for (let panel of panels) {
            if (!(panel.vertical === this.vertical)) continue
            if (isPanelIntersect(this, panel)) continue
            const margin = Math.max(this.panelMargin, panel.panelMargin)
            if (this.vertical) {
                if (x >= panel.rect.x) {
                    if (x - (panel.rect.x + panel.thickness) < margin) return false
                    if (panel.rect.x + this.thickness <= x) this.parallelFromBack.add(panel)
                }
                if (x < panel.rect.x) {
                    if ((panel.rect.x - (x + this.thickness) < margin)) return false
                    if (panel.rect.x >= x) this.parallelFromFront.add(panel)
                }
            } else {
                if (y >= panel.rect.y) {
                    if (y - (panel.rect.y + panel.thickness) < margin) return false
                    if (panel.rect.y + this.thickness <= y) this.parallelFromBack.add(panel)
                }
                if (y < panel.rect.y) {
                    if ((panel.rect.y - (y + this.thickness) < margin)) return false
                    if (panel.rect.y >= y) this.parallelFromFront.add(panel)
                }
            }
        }
        return true
    }
    findDimensions(x, y, panels, wardrobe) {
        let minX = this.thickness
        let maxX = wardrobe.width - this.thickness
        let minY = 46
        let maxY = wardrobe.height - this.thickness
        for (let panel of panels) {
            if (panel === this) continue
            if (this.vertical === panel.vertical) continue
            if (this.vertical) {
                if ((x - panel.rect.x) * (x - panel.rect.last.x) > 0) continue //if panels not intersect
                if (panel.rect.y <= y) {
                    if (panel.rect.y + panel.thickness >= minY) {
                        minY = panel.rect.y + panel.thickness
                        this.jointToFront = panel
                    }
                }
                if (panel.rect.y > y) {
                    if (panel.rect.y <= maxY) {
                        maxY = panel.rect.y
                        this.jointToBack = panel
                    }
                }
            } else {
                if ((y - panel.rect.y) * (y - panel.rect.last.y) > 0) continue //if panels not intersect
                if (panel.rect.x <= x) {
                    if (panel.rect.x + panel.thickness >= minX) {
                        minX = panel.rect.x + panel.thickness
                        this.jointToFront = panel
                    }
                }
                if (panel.rect.x > x) {
                    if (panel.rect.x <= maxX) {
                        maxX = panel.rect.x
                        this.jointToBack = panel
                    }
                }
            }
        }
        this.model.length = this.vertical ? maxY - minY : maxX - minX
        this.rect = this.vertical ? { x, y: minY } : { x: minX, y }
        this.refresh()
    }
    isInSelectionRect({ topLeft, bottomRight }) {
        const inRect = [Geometry.pointInRect(this.rect, topLeft, bottomRight),
        Geometry.pointInRect(this.rect.last, topLeft, bottomRight)];
        const full = inRect.every(i => i === true);
        const cross = Intersection.RectangleRectangle(topLeft, bottomRight, this.rect, this.rect.last).length > 0;
        return { cross, full };
    }
}