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
        const width = model.vertical ? 16 : model.length
        const height = model.vertical ? model.length : 16
        const last = { x: model.position.x + width, y: model.position.y + height }
        this.rect = { ...model.position, last, width, height }
        this.setStyle(new ShapeStyle(Color.BLACK, ShapeStyle.SOLID));
        this.jointFromBackSide = model.jointFromBackSide || []
        this.jointFromFrontSide = model.jointFromFrontSide || []
        this.nearestFromBack = model.nearestFromBack
        this.nearestFromFront = model.nearestFromBack
    }

    drawSelf(ctx, realRect, screenRect, print = false) {
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
        if (this.vertical) this.rect.height = this.model.length; else this.rect.width = this.model.length
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
    canBePlaced(x, y, minDist) {
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
    isInRect({ topLeft, bottomRight }) {
        const inRect = [Geometry.pointInRect(this.rect, topLeft, bottomRight),
        Geometry.pointInRect(this.rect.last, topLeft, bottomRight)];
        const full = inRect.every(i => i === true);
        const cross = Intersection.RectangleRectangle(topLeft, bottomRight, this.rect, this.rect.last).length > 0;
        return { cross, full };
    }
}