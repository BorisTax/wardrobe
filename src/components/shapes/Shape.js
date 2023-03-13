import { Color } from '../colors';
import ShapeStyle from './ShapeStyle';
export default class Shape {
    static PANEL = "PANEL"
    static DOUBLE_PANEL = "DOUBLE_PANEL"
    static DIMENSION = "DIMENSION"
    static DRAWER = "DRAWER"
    static TUBE = "TUBE"

    constructor() {
        this.style = new ShapeStyle(Color.BLACK, ShapeStyle.SOLID);
        this.selectedStyle = new ShapeStyle(Color.SELECTED, ShapeStyle.SOLID);
        this.highlightedStyle = new ShapeStyle(Color.BLACK, ShapeStyle.SOLID, 2);
        this.errorStyle = new ShapeStyle(Color.RED, ShapeStyle.SOLID)
        this.defaultStyle = new ShapeStyle(Color.BLACK, ShapeStyle.SOLID, 1)
        this.state = { selected: false, inSelection: false, underCursor: false, highlighted: false };
        this.properties = [];

    }

    getProperties(){
        this.properties.forEach(p => p.value = this[p.key])
        return this.properties
      }
    setProperty({key, value}){
        this[key] = value
    }
    refreshStyle(ctx) {
        this.setState(this.state)
        ctx.strokeStyle = this.getStyle().getColor();
        ctx.fillStyle = this.getStyle().getColor();
        ctx.setLineDash(this.getStyle().getStroke());
        ctx.lineWidth = this.getStyle().getWidth();
    }
    drawSelf(ctx, realRect, screenRect) {
        this.refresh(realRect, screenRect);
        this.refreshStyle(ctx)
    }


    setColor(color) {
        this.style.setColor(color);
        this.fillStyle = color
    }
    getColor() {
        return this.style.getColor();
    }
    getStyle() {
        return this.style;
    }

    setStyle(style) {
        this.style = style;

    }

    setFillStyle(fill) {
        this.fillStyle = fill;
    }
    setState(state) {
        this.state = { ...this.state, ...state };
        if (this.state.selected === true) {
            this.setStyle(this.selectedStyle);
            
            return;
        } else {
            this.setStyle(this.defaultStyle);
            if (this.state.highlighted) this.setStyle(this.highlightedStyle)
        }
        if (this.state.highlighted) this.setStyle(this.highlightedStyle);
        if (this.state.error) this.setStyle(this.errorStyle);
    }
    getState() {
        return this.state;
    }
    getSingleDimensionData(){

        return {hasDimension: false}
      }
}