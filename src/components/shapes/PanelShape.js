import Geometry, { Intersection } from '../../utils/geometry';
import Shape from "./Shape";
import ShapeStyle from './ShapeStyle';
import { Color } from '../colors';
import { isPanelIntersect } from '../../reducers/panels';
export default class PanelShape extends Shape {
    constructor(model) {
        super();
        this.model = { ...model };
        this.gabarit = model.gabarit //габаритная деталь
        this.panelMargin = model.panelMargin || 0
        if (!model.active) this.model.active = false
        this.vertical = model.vertical
        this.minLength = model.minLength || 282
        this.selectable = model.selectable === undefined ? true : model.selectable
        this.moveable = model.moveable === undefined ? true : model.moveable
        this.hidden = model.hidden
        this.thickness = model.thickness || 16
        const position = model.position || { x: 0, y: 0 }
        const width = model.vertical ? this.thickness : model.length
        const height = model.vertical ? model.length : this.thickness
        const last = { x: position.x + width, y: position.y + height }
        this.rect = { ...position, last, width, height }
        this.setStyle(new ShapeStyle(Color.BLACK, ShapeStyle.SOLID));
        this.jointFromBackSide = model.jointFromBackSide || new Set()
        this.jointFromFrontSide = model.jointFromFrontSide || new Set()
        this.parallelFromBack = model.parallelFromBack || new Set()
        this.parallelFromFront = model.parallelFromFront || new Set()
        this.dimensions = new Set()
    }

    drawSelf(ctx, realRect, screenRect, print = false) {
        if (this.hidden) return
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
        this.hidden = hidden
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

    isPointInside(p, pixelRatio) {
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
        if (this.isMoveAvailable({newX, newY, dx, dy})) {
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
    isMoveAvailable({newX: x, newY: y, dx, dy}) {
        if (!this.moveable) return false
        for (let joint of this.jointFromBackSide) {
            if(joint.getLength() + (dx + dy) < joint.minLength) return false
        }
        for (let joint of this.jointFromFrontSide) {
            if(joint.getLength() - (dx + dy) < joint.minLength) return false
        }
        for (let par of this.parallelFromBack) {
            const parPos = par.getPosition();
            if ((((x - parPos.x - this.thickness) < this.panelMargin) && this.vertical) || (((y - parPos.y - this.thickness) < this.panelMargin) && !this.vertical)) {
                return false
            }
        }
        for (let par of this.parallelFromFront) {
            const parPos = par.getPosition();
            if ((((parPos.x - x - this.thickness) < this.panelMargin) && this.vertical) || (((parPos.y - y - this.thickness) < this.panelMargin) && !this.vertical)) {
                return false
            }
        }
        return true
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
                if (x >= panel.rect.x){
                    if (x - (panel.rect.x + panel.thickness) < margin) return false
                    if (panel.rect.x + this.thickness <= x) this.parallelFromBack.add(panel)
                }
                if (x < panel.rect.x){
                    if ((panel.rect.x - (x + this.thickness) < margin)) return false
                    if (panel.rect.x >=x) this.parallelFromFront.add(panel)
                }
            } else {
                if (y >= panel.rect.y){
                    if (y - (panel.rect.y + panel.thickness) < margin) return false
                    if (panel.rect.y + this.thickness <= y) this.parallelFromBack.add(panel)
                }
                if (y < panel.rect.y){
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
    isInRect({ topLeft, bottomRight }) {
        const inRect = [Geometry.pointInRect(this.rect, topLeft, bottomRight),
        Geometry.pointInRect(this.rect.last, topLeft, bottomRight)];
        const full = inRect.every(i => i === true);
        const cross = Intersection.RectangleRectangle(topLeft, bottomRight, this.rect, this.rect.last).length > 0;
        return { cross, full };
    }
}