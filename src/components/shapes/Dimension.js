import Geometry, { Intersection } from '../../utils/geometry';
import Shape from "./Shape";
import { drawArrow } from '../../functions/drawFunctions';
import ShapeStyle from './ShapeStyle';
import { Color } from '../colors';
import TextShape from './TextShape';
export default class Dimension extends Shape {
    type = Shape.DIMENSION
    constructor({ vertical, firstPoint, secondPoint }) {
        super();
        this.vertical = vertical
        this.firstPoint = firstPoint
        this.secondPoint = secondPoint
        this.offsetPoint = {}
        this.length = 0
        this.state.selectable = true
        this.state.deletable = true
        this.state.fixable = false
        this.state.fixed = false
        this.captionShape = new TextShape(this.length, {}, vertical ? -Math.PI / 2 : 0, { vertical: vertical ? TextShape.CENTER : TextShape.BOTTOM, horizontal: vertical ? TextShape.CENTER : TextShape.CENTER })
        this.captionShape.setFillStyle(Color.BLACK);

        this.style = new ShapeStyle(Color.DARK_GRAY, ShapeStyle.DASH, 1);
        this.defaultStyle = new ShapeStyle(Color.DARK_GRAY, ShapeStyle.DASH, 1);
        this.selectedStyle = new ShapeStyle(Color.SELECTED, ShapeStyle.DASH, 2);
        this.highlightedStyle = new ShapeStyle(Color.BLACK, ShapeStyle.DASH, 1);
    }

    drawSelf(ctx, realRect, screenRect, print = false) {
        if (this.hidden) return
        super.drawSelf(ctx, realRect, screenRect)
        const first = Geometry.realToScreen(this.firstPoint, realRect, screenRect);
        const second = Geometry.realToScreen(this.secondPoint, realRect, screenRect);
        const offsetPoint = Geometry.realToScreen(this.offsetPoint, realRect, screenRect);
        let screenOffsetFirst, screenOffsetSecond
        let arrowSize
        ctx.beginPath()
        if (this.vertical) {
            screenOffsetFirst = offsetPoint.x - first.x
            screenOffsetSecond = offsetPoint.x - second.x
            arrowSize = first.y - second.y
            ctx.moveTo(first.x + 0.5, first.y + 0.5)
            ctx.lineTo(first.x + 0.5 + screenOffsetFirst, first.y + 0.5)
            ctx.moveTo(second.x + 0.5, second.y + 0.5)
            ctx.lineTo(second.x + 0.5 + screenOffsetSecond, second.y + 0.5)
        } else {
            screenOffsetFirst = offsetPoint.y - first.y
            screenOffsetSecond = offsetPoint.y - second.y
            arrowSize = second.x - first.x
            ctx.moveTo(first.x + 0.5, first.y + 0.5)
            ctx.lineTo(first.x + 0.5, first.y + 0.5 + screenOffsetFirst)
            ctx.moveTo(second.x + 0.5, second.y + 0.5)
            ctx.lineTo(second.x + 0.5, second.y + 0.5 + screenOffsetSecond)
        }
        ctx.stroke()
        const prevStroke = this.getStyle().getStroke()
        this.getStyle().setStroke(ShapeStyle.SOLID)
        this.refreshStyle(ctx)
        ctx.beginPath()
        drawArrow(ctx, this.vertical, offsetPoint, arrowSize, 5)
        ctx.stroke()
        this.captionShape.setFitRect({ width: 500, height: 500, fit: true })
        this.captionShape.getStyle().setWidth(this.style.width)
        this.captionShape.getStyle().setColor(this.style.color)
        this.captionShape.refreshStyle(ctx)
        const offset = this.vertical ? { x: 0, y: -10 } : undefined
        this.captionShape.drawSelf(ctx, realRect, screenRect, null, offset)
        this.getStyle().setStroke(prevStroke)
        this.refreshStyle(ctx)
    }
    refresh() {
        if (this.vertical) {
            this.offsetPoint.y = this.midPoint.y
            this.length = this.secondPoint.y - this.firstPoint.y
        } else {
            this.offsetPoint.x = this.midPoint.x
            this.length = this.secondPoint.x - this.firstPoint.x
        }
        this.captionShape.setPoint(this.offsetPoint)
        this.setCaption()

    }
    getPosition() {
        return this.offsetPoint
    }
    moveTo(dx, dy, wardrobe) {
        const point = { x: this.vertical ? this.offsetPoint.x + dx : this.offsetPoint.x, y: this.vertical ? this.offsetPoint.y : this.offsetPoint.y + dy }
        this.setOffsetPoint(point, wardrobe)
        this.refresh()

    }
    setCaption() {
        this.captionShape.setText(this.length);
    }

    setHidden(hidden) {
        this.hidden = hidden
    }
    setOffsetPoint(offsetPoint, wardrobe) {
        const max = 500
        this.offsetPoint = offsetPoint
        if (this.offsetPoint.x < -max) this.offsetPoint.x = -max
        if (this.offsetPoint.x > wardrobe.width + max) this.offsetPoint.x = wardrobe.width + max
        if (this.offsetPoint.y < -max) this.offsetPoint.y = -max
        if (this.offsetPoint.y > wardrobe.height + max) this.offsetPoint.y = wardrobe.height + max
        this.refresh()
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
        return this.vertical ?
            (p.x >= this.offsetPoint.x - pixelRatio * mult) && (p.x <= this.offsetPoint.x + pixelRatio * mult) && (p.y <= this.secondPoint.y) && (p.y >= this.firstPoint.y) :
            (p.y >= this.offsetPoint.y - pixelRatio * mult) && (p.y <= this.offsetPoint.y + pixelRatio * mult) && (p.x <= this.secondPoint.x) && (p.x >= this.firstPoint.x);
    }

    isInSelectionRect({ topLeft, bottomRight }) {
        const firstPoint = {}
        const secondPoint = {}
        if (this.vertical) {
            firstPoint.x = this.offsetPoint.x
            secondPoint.x = this.offsetPoint.x
            firstPoint.y = this.offsetPoint.y - this.length / 2
            secondPoint.y = this.offsetPoint.y + this.length / 2
        } else {
            firstPoint.x = this.offsetPoint.x - this.length / 2
            secondPoint.x = this.offsetPoint.x + this.length / 2
            firstPoint.y = this.offsetPoint.y
            secondPoint.y = this.offsetPoint.y
        }
        const inRect = [Geometry.pointInRect(firstPoint, topLeft, bottomRight),
        Geometry.pointInRect(secondPoint, topLeft, bottomRight)];
        const full = inRect.every(i => i === true);
        const dimLine = { p1: firstPoint, p2: secondPoint }
        const cross = Intersection.LineRectangle(dimLine, topLeft, bottomRight).length > 0


        return { cross, full };
    }
}