import Geometry, { Intersection } from '../../utils/geometry';
import Shape from "./Shape";
import ShapeStyle from './ShapeStyle';
import { Color } from '../colors';
export default class PanelShape extends Shape {
    constructor(model) {
        super();
        this.model = { ...model };
        if (!model.active) this.model.active = false
        this.vertical = model.vertical
        this.selectable = !!model.selectable
        this.hidden = model.hidden
        const position = model.position || { x: 0, y: 0 }
        const width = model.vertical ? 16 : model.length
        const height = model.vertical ? model.length : 16
        const last = { x: position.x + width, y: position.y + height }
        this.rect = { ...position, last, width, height }
        this.setStyle(new ShapeStyle(Color.BLACK, ShapeStyle.SOLID));
        this.jointFromBackSide = model.jointFromBackSide || []
        this.jointFromFrontSide = model.jointFromFrontSide || []
        this.parallelFromBack = model.parallelFromBack || []
        this.parallelFromFront = model.parallelFromFront || []
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
            this.rect.width = 16
        } else {
            this.rect.width = this.model.length
            this.rect.height = 16
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

    isPointInside(p) {
        return (p.x >= this.rect.x) && (p.x <= this.rect.x + this.rect.width) && (p.y >= this.rect.y) && (p.y <= this.rect.y + this.rect.height);
    }
    getDistance(point) {

    }
    canBeMoved(x, y, minDist) {
        for (let par of this.parallelFromBack) {
            const parPos = par.getPosition();
            if ((((x - parPos.x) < minDist) && this.vertical) || (((y - parPos.y) < minDist) && !this.vertical)) {
                return false
            }
        }
        for (let par of this.parallelFromFront) {
            const parPos = par.getPosition();
            if ((((parPos.x - x) < minDist) && this.vertical) || (((parPos.y - y) < minDist) && !this.vertical)) {
                return false
            }
        }
        return true
    }
    isNotIntersect(panel) {
        let d
        if (this.vertical)
            d = Math.max(this.rect.y + this.model.length, panel.rect.y + panel.model.length) -
                Math.min(this.rect.y, panel.rect.y);
        else d = Math.max(this.rect.x + this.model.length, panel.rect.x + panel.model.length) -
            Math.min(this.rect.x, panel.rect.x)
        return d > (this.model.length + panel.model.length)
    }
    canBePlaced(x, y, minDist, panels, wardrobe) {
        if (x < 16 || x > wardrobe.width - 16 || y < 46 || y > wardrobe.height - 16) return false
        this.parallelFromBack = []
        this.parallelFromFront = []
        for (let panel of panels) {
            if (!(panel.vertical === this.vertical)) continue
            if (this.isNotIntersect(panel)) continue
            if (this.vertical) {
                if (panel.rect.x + 16 < x) this.parallelFromBack.push(panel)
                if (panel.rect.x > x) this.parallelFromFront.push(panel)
                if (Math.abs(x - panel.rect.x - 16) < minDist) return false
            } else {
                if (panel.rect.y + 16 < y) this.parallelFromBack.push(panel)
                if (panel.rect.y > y) this.parallelFromFront.push(panel)
                if (Math.abs(y - panel.rect.y - 16) < minDist) return false
            }
        }
        return true
    }
    findDimensions(x, y, panels, wardrobe) {
        let minX = 16
        let maxX = wardrobe.width - 16
        let minY = 46
        let maxY = wardrobe.height - 16
        for (let panel of panels) {
            if (panel === this) continue
            if (this.vertical === panel.vertical) continue
            if (this.vertical) {
                if ((x - panel.rect.x) * (x - panel.rect.x - panel.rect.width) > 0) continue //if panels not intersect
                if (panel.rect.y + 16 < y) {
                    if (panel.rect.y + 16 > minY) {
                        minY = panel.rect.y + 16
                        this.jointToFront = panel
                    }
                }
                if (panel.rect.y > y) {
                    if (panel.rect.y < maxY) {
                        maxY = panel.rect.y
                        this.jointToBack = panel
                    }
                }
            } else {
                if ((y - panel.rect.y) * (y - panel.rect.y - panel.rect.height) > 0) continue //if panels not intersect
                if (panel.rect.x + 16 < x) {
                    if (panel.rect.x + 16 > minX) {
                        minX = panel.rect.x + 16
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