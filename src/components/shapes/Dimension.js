import Geometry, { Intersection } from '../../utils/geometry';
import Shape from "./Shape";
import { drawArrow } from '../../functions/drawFunctions';
import ShapeStyle from './ShapeStyle';
import { Color } from '../colors';
import TextShape from './TextShape';
export default class Dimension extends Shape {
    constructor({ vertical, firstPoint, secondPoint }) {
        super();
        this.vertical = vertical
        this.firstPoint = firstPoint
        this.secondPoint = secondPoint
        this.offsetPoint = {}
        this.length = 0
        this.selectable = true
        this.captionShape = new TextShape(this.length, {}, 0, { vertical: TextShape.CENTER, horizontal: TextShape.CENTER })
        this.captionShape.setFillStyle(Color.BLACK);

        this.style = new ShapeStyle(Color.DARK_GRAY, ShapeStyle.DASH, 1);
        this.defaultStyle = new ShapeStyle(Color.DARK_GRAY, ShapeStyle.DASH, 1);
        this.selectedStyle = new ShapeStyle(Color.SELECTED, ShapeStyle.DASH, 2);
        this.highlightedStyle = new ShapeStyle(Color.BLACK, ShapeStyle.DASH, 1);
    }

    drawSelf(ctx, realRect, screenRect, print = false) {
        if (this.hidden) return
        super.drawSelf(ctx, realRect, screenRect)
        //if (this.state.selected || this.state.highlighted) { this.getStyle().setWidth(2) } else { this.getStyle().setWidth(1) }
        const first = Geometry.realToScreen(this.firstPoint, realRect, screenRect);
        const second = Geometry.realToScreen(this.secondPoint, realRect, screenRect);
        const offsetPoint = Geometry.realToScreen(this.offsetPoint, realRect, screenRect);
        let screenOffset
        const middle = { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 }
        let arrowSize
        ctx.beginPath()
        if (this.vertical) {
            screenOffset = offsetPoint.x - middle.x
            arrowSize = first.y - second.y
            ctx.moveTo(first.x + 0.5, first.y + 0.5)
            ctx.lineTo(first.x + 0.5 + screenOffset, first.y + 0.5)
            ctx.moveTo(second.x + 0.5, second.y + 0.5)
            ctx.lineTo(second.x + 0.5 + screenOffset, second.y + 0.5)
        } else {
            screenOffset = offsetPoint.y - middle.y
            arrowSize = second.x - first.x
            ctx.moveTo(first.x + 0.5, first.y + 0.5)
            ctx.lineTo(first.x + 0.5, first.y + 0.5 + screenOffset)
            ctx.moveTo(second.x + 0.5, second.y + 0.5)
            ctx.lineTo(second.x + 0.5, second.y + 0.5 + screenOffset)
        }
        ctx.stroke()
        const prevStroke = this.getStyle().getStroke()
        this.getStyle().setStroke(ShapeStyle.SOLID)
        this.refreshStyle(ctx)
        ctx.beginPath()
        drawArrow(ctx, this.vertical, offsetPoint, arrowSize, 5)
        ctx.stroke()
        this.captionShape.setFitRect({width: 500, height:500, fit: true})
        this.captionShape.drawSelf(ctx, realRect, screenRect)
        this.getStyle().setStroke(prevStroke)
        this.refreshStyle(ctx)
    }
    refresh() {
        const middlePoint = { x: (this.firstPoint.x + this.secondPoint.x) / 2, y: (this.firstPoint.y + this.secondPoint.y) / 2 }
        if (this.vertical) {
            this.offsetPoint.x = middlePoint.x + this.offset
            this.offsetPoint.y = middlePoint.y
            this.length = this.secondPoint.y - this.firstPoint.y
        } else {
            this.offsetPoint.x = middlePoint.x
            this.offsetPoint.y = middlePoint.y + this.offset
            this.length = this.secondPoint.x - this.firstPoint.x
        }
        this.captionShape.setPoint(this.offsetPoint)
        this.setCaption()

    }
    getPosition() {
        return this.offsetPoint
    }
    moveTo(dx, dy) {
        if (this.vertical) this.offset += dx; else this.offset += dy;
        this.refresh()

    }
    setCaption() {
        this.captionShape.setText(this.length);
    }

    setHidden(hidden) {
        this.hidden = hidden
    }
    setOffset(offset) {
        this.offset = offset
        this.refresh()
    }
    getOffset() {
        return this.offset
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
        return this.vertical ?
            (p.x >= this.offsetPoint.x - pixelRatio * mult) && (p.x <= this.offsetPoint.x + pixelRatio * mult) && (p.y <= this.secondPoint.y) && (p.y >= this.firstPoint.y) :
            (p.y >= this.offsetPoint.y - pixelRatio * mult) && (p.y <= this.offsetPoint.y + pixelRatio * mult) && (p.x <= this.secondPoint.x) && (p.x >= this.firstPoint.x);
    }

    isInRect({ topLeft, bottomRight }) {
        const inRect = [Geometry.pointInRect(this.rect, topLeft, bottomRight),
        Geometry.pointInRect(this.rect.last, topLeft, bottomRight)];
        const full = inRect.every(i => i === true);
        const cross = Intersection.RectangleRectangle(topLeft, bottomRight, this.rect, this.rect.last).length > 0;
        return { cross, full };
    }
}