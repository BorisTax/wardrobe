import { drawArrow } from "../../../functions/drawFunctions";
import Cursor from "./Cursor";

export default class ResizeCursor extends Cursor {
    constructor(point, vertical) {
        super(point);
        this.vertical = !vertical;
    }
    draw(ctx, realRect, screenRect) {
        this.refresh(realRect, screenRect);
        ctx.strokeStyle = this.getStyle().getColor();
        ctx.setLineDash(this.getStyle().getStroke());
        ctx.lineWidth = 2//this.getStyle().getWidth();
        ctx.beginPath();
        drawArrow(ctx, this.vertical, this.p0, 30, 6)
        ctx.stroke();
    }
}
