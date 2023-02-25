import Cursor from "./Cursor";

export default class ResizeCursor extends Cursor {
    constructor(point, vertical) {
        super(point);
        this.vertical = vertical;
    }
    drawSelf(ctx, realRect, screenRect) {
        this.refresh(realRect, screenRect);
        ctx.strokeStyle = this.getStyle().getColor();
        ctx.setLineDash(this.getStyle().getStroke());
        ctx.lineWidth = this.getStyle().getWidth();
        let size = 15;
        let arrow = size / 3
        ctx.beginPath();
        if (this.vertical) {
            ctx.moveTo(this.p0.x - size + 0.5, this.p0.y + 0.5);
            ctx.lineTo(this.p0.x + size + 0.5, this.p0.y + 0.5);
            ctx.moveTo(this.p0.x - size + 0.5, this.p0.y + 0.5);
            ctx.lineTo(this.p0.x - size + 0.5 + arrow, this.p0.y + 0.5 - arrow);
            ctx.moveTo(this.p0.x - size + 0.5, this.p0.y + 0.5);
            ctx.lineTo(this.p0.x - size + 0.5 + arrow, this.p0.y + 0.5 + arrow);
            ctx.moveTo(this.p0.x + size + 0.5, this.p0.y + 0.5);
            ctx.lineTo(this.p0.x + size + 0.5 - arrow, this.p0.y + 0.5 - arrow);
            ctx.moveTo(this.p0.x + size + 0.5, this.p0.y + 0.5);
            ctx.lineTo(this.p0.x + size + 0.5 - arrow, this.p0.y + 0.5 + arrow);
        } else {
            ctx.moveTo(this.p0.x + 0.5, this.p0.y - size + 0.5);
            ctx.lineTo(this.p0.x + 0.5, this.p0.y + size + 0.5);
            ctx.moveTo(this.p0.x + 0.5, this.p0.y - size + 0.5);
            ctx.lineTo(this.p0.x + 0.5 - arrow, this.p0.y - size + 0.5 + arrow);
            ctx.moveTo(this.p0.x + 0.5, this.p0.y - size + 0.5);
            ctx.lineTo(this.p0.x + 0.5 + arrow, this.p0.y - size + 0.5 + arrow);
            ctx.moveTo(this.p0.x + 0.5, this.p0.y + size + 0.5);
            ctx.lineTo(this.p0.x + 0.5 - arrow, this.p0.y + size + 0.5 - arrow);
            ctx.moveTo(this.p0.x + 0.5, this.p0.y + size + 0.5);
            ctx.lineTo(this.p0.x + 0.5 + arrow, this.p0.y + size + 0.5 - arrow);
        }


        ctx.stroke();
    }
}
