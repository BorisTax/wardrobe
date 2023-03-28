import Cursor from "./Cursor";

export default class DimensionCursor extends Cursor {
    static ORD = "ord"
    static VERT = "vert"
    static HOR = "hor"
    type = DimensionCursor.ORD
    draw(ctx, realRect, screenRect) {
        this.refresh(realRect, screenRect);
        ctx.strokeStyle = this.getStyle().getColor();
        ctx.setLineDash(this.getStyle().getStroke());
        ctx.lineWidth = 2;
        const cursor = this.getCursor(this.p0)
        const path = new Path2D(cursor);

        ctx.fill(path);
        ctx.stroke(path);
    }
    setType(type) {
        this.type = type
    }
    getCursor(p) {
        const types = {
            [DimensionCursor.ORD]: `M${p.x + 10} ${p.y}l-8.506 8.506 0 -8.506 8.506 0zm-6.69 24.41l22.66 -22.66 -22.66 22.66zm-2.557 -3.145l5.703 5.702 -5.703 -5.702zm21.996 -21.996l5.702 5.703 -5.702 -5.703z`,
            [DimensionCursor.VERT]: `M${p.x + 10} ${p.y}l-7.211 7.211 0 -7.211 7.211 0zm8.712 24.514l0 -27.168 0 27.168zm-3.419 -0.352l6.837 0 -6.837 0zm0 -26.372l6.837 0 -6.837 0z`,
            [DimensionCursor.HOR]: `M${p.x + 10} ${p.y}l-8.359 8.359 0 -8.359 8.359 0zm-11.436 17.434l31.496 0 -31.496 0zm0.409 -3.964l0 7.927 0 -7.927zm30.573 0l0 7.927 0 -7.927z`,
        }
        return types[this.type]
    }

}
