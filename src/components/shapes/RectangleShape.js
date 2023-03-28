import Geometry, { Rectangle, Coord2D, Line, Intersection } from '../../utils/geometry';
import Shape from "./Shape";
import { PropertyTypes } from "./PropertyData";
export default class RectangleShape extends Shape {
    constructor(model) {
        super();
        this.model = model;
        this.rect = new Rectangle()
        this.properties = [
            { type: PropertyTypes.VERTEX, value: model.topLeft, labelKey: "p1" },
            { type: PropertyTypes.VERTEX, value: model.bottomRight, labelKey: "p2" },
        ]
        //this.defineProperties();
    }

    draw(ctx, realRect, screenRect, fill = false) {
        super.draw(ctx, realRect, screenRect)
        let x = this.rect.topLeft.x
        let y = this.rect.topLeft.y
        if (fill) {
            ctx.fillStyle = this.fillStyle;
            ctx.fillRect(x, y, this.rect.width, this.rect.height);
        }
        ctx.strokeRect(x, y, this.rect.width, this.rect.height);
    }
    refresh(realRect, screenRect) {
        this.rect.topLeft = Geometry.realToScreen(this.model.topLeft, realRect, screenRect);
        this.rect.bottomRight = Geometry.realToScreen(this.model.bottomRight, realRect, screenRect);
        this.rect.width = this.rect.bottomRight.x - this.rect.topLeft.x
        this.rect.height = this.rect.bottomRight.y - this.rect.topLeft.y
    }
    getMarkers() {
        let list = [];
        return list;
    }
    setCorners(topLeft, bottomRight) {
        this.properties[0].value = { x: topLeft.x, y: topLeft.y }
        this.properties[1].value = { x: bottomRight.x, y: bottomRight.y }
        this.refreshModel()
    }
    refreshModel() {
        this.model.topLeft = this.properties[0].value;
        this.model.bottomRight = this.properties[1].value;
        this.model.width = this.model.bottomRight.x - this.model.topLeft.x;
        this.model.height = this.model.topLeft.y - this.model.bottomRight.y;
    }
    getDistance(point) {
        let tl = this.model.topLeft;
        let tr = new Coord2D(tl.x + this.model.width, tl.y);
        let bl = new Coord2D(tl.x, tl.y - this.model.height);
        let br = new Coord2D(tl.x + this.model.width, tl.y - this.model.height);
        let top = new Line(tl, tr);
        let bottom = new Line(bl, br);
        let right = new Line(tr, br);
        let left = new Line(tl, bl);
        return Math.min(Geometry.PointToLineDistance(point, top),
            Geometry.PointToLineDistance(point, left),
            Geometry.PointToLineDistance(point, bottom),
            Geometry.PointToLineDistance(point, right));
    }
    isInSelectionRect(topLeft, bottomRight) {
        const inRect = [Geometry.pointInRect(this.model.topLeft, topLeft, bottomRight),
        Geometry.pointInRect(this.model.bottomRight, topLeft, bottomRight)];
        const full = inRect.every(i => i === true);
        const cross = Intersection.RectangleRectangle(topLeft, bottomRight, this.model.topLeft, this.model.bottomRight).length > 0;
        return { cross, full };
    }
    toString() {
        return "Rectangle";
    }
    getDescription() {
        return 'Rectangle';
    }
}