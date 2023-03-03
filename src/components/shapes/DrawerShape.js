import Geometry, { Intersection } from '../../utils/geometry';
import Shape from "./Shape";
import PanelShape from './PanelShape';
export default class DrawerShape extends PanelShape {
    type = Shape.DRAWER
    constructor(model) {
        super({ ...model, vertical: false, thickness: 140, panelMargin: 10, name: "Ящик" });

    }

    drawSelf(ctx, realRect, screenRect, print = false) {
        if (this.state.hidden) return
        this.refresh(realRect, screenRect);
        this.refreshStyle(ctx)
        if (this.state.selected || this.state.highlighted) { this.getStyle().setWidth(2) } else { this.getStyle().setWidth(1) }
        const rect = { x: this.rect.x + 4, y: this.rect.y, last: { x: this.rect.last.x - 4, y: this.rect.last.y } }
        const topLeft = Geometry.realToScreen(rect, realRect, screenRect);
        const bottomRight = Geometry.realToScreen(rect.last, realRect, screenRect);
        const width = bottomRight.x - topLeft.x
        const height = bottomRight.y - topLeft.y
        let x = Math.trunc(topLeft.x) + 0.5
        let y = Math.trunc(topLeft.y) + 0.5
        ctx.strokeRect(x, y, width, height);
    }

    isInSelectionRect({ topLeft, bottomRight }) {
        const inRect = [Geometry.pointInRect(this.rect, topLeft, bottomRight),
        Geometry.pointInRect(this.rect.last, topLeft, bottomRight)];
        const full = inRect.every(i => i === true);
        const cross = Intersection.RectangleRectangle(topLeft, bottomRight, this.rect, this.rect.last).length > 0;
        return { cross, full };
    }
}