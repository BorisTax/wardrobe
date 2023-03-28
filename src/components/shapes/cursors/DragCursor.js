import Cursor from "./Cursor";

export default class DragCursor extends Cursor{
    static DRAG = "DRAG"
    static NODRAG = "NODRAG"
    type = DragCursor.DRAG
    hint = ""
    draw(ctx, realRect,  screenRect){
        this.refresh(realRect,screenRect);
        ctx.strokeStyle=this.getStyle().getColor();
        ctx.setLineDash(this.getStyle().getStroke());
        ctx.lineWidth=2;  
        const cursor = this.getCursor(this.p0)
        const path = new Path2D(cursor);        
        ctx.fill(path);
        ctx.stroke(path);
        if (this.hint) {
            ctx.fillStyle = "black"
            ctx.font = "14px sans-serif"
            ctx.fillText(this.hint, this.p0.x, this.p0.y + 30)
        }
    }
    setType(type, hint) {
        this.type = type
        this.hint = hint
    }
    getCursor(p) {
        const types = {
            [DragCursor.DRAG]: `M${p.x} ${p.y}l0 9.94m-5.05 0c0,-5.382 -0.086,-5.266 0,-7.791 0.029,-4.141 4.358,-4.141 5.05,-2.15 0.202,-4.271 5.079,-4.386 5.497,-0.115 0.476,-2.222 4.675,-2.107 4.949,0.678 0.346,-1.054 3.967,-2.078 4.328,1.976 0.13,1.429 -0.014,6.291 -0.029,9.392 -1.053,17.069 -22.465,16.539 -25.264,-0.644 -0.911,-3.53 3.518,-5.453 5.469,-1.346zm10.547 -10.056l0 10.056m4.949 -9.378l0 9.378 0 -9.378z`,
            [DragCursor.NODRAG]: `M${p.x+15} ${p.y+15}l-27.479 -27.479m0 27.479l27.479 -27.479m-16.856 1.525l0 10.403m-5.285 0c0,-5.632 -0.09,-5.511 0,-8.154 0.031,-4.333 4.56,-4.333 5.285,-2.25 0.212,-4.469 5.315,-4.589 5.753,-0.12 0.498,-2.325 4.892,-2.205 5.179,0.709 0.362,-1.102 4.151,-2.174 4.529,2.069 0.136,1.495 -0.014,6.583 -0.03,9.829 -1.102,17.862 -23.511,17.308 -26.439,-0.675 -0.953,-3.694 3.681,-5.706 5.723,-1.408zm11.038 -10.524l0 10.524m5.179 -9.814l0 9.814 0 -9.814z`,
        }
        return types[this.type]
    }

}
