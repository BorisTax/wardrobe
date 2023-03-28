import Geometry from '../../utils/geometry';
import Shape from "./Shape";
import PanelShape from './PanelShape';
import { PropertyTypes } from './PropertyData';
export default class TubeShape extends PanelShape {
    type = Shape.TUBE
    constructor(data) {
        super({ ...data, vertical: false, thickness: 50, panelMargin: 0, name: "Труба" });
        this.state.measurable = false
        this.properties = [
            {key: "name", type: PropertyTypes.STRING},
            {key: "length", type: PropertyTypes.INTEGER_POSITIVE_NUMBER},
        ]
    }

    draw(ctx, realRect, screenRect, print = false) {
        if (this.state.hidden) return
        this.refresh(realRect, screenRect);
        this.refreshStyle(ctx)
        if (this.state.selected || this.state.highlighted) { this.getStyle().setWidth(2) } else { this.getStyle().setWidth(1) }
        const rect = { x: this.rect.x, y: this.rect.y, last: { x: this.rect.last.x, y: this.rect.last.y } }
        const flanWidth = 20
        const leftFlan = {topLeft: {x: rect.x, y: rect.y + this.thickness}, bottomRight: {x: rect.x + flanWidth, y: rect.y}}
        const rightFlan = {topLeft: {x: rect.last.x - flanWidth, y: rect.last.y}, bottomRight: {x: rect.last.x, y: rect.y}}
        const tube = {topLeft: {x: leftFlan.bottomRight.x, y: leftFlan.topLeft.y - 10}, bottomRight: {x: rightFlan.topLeft.x, y: rightFlan.bottomRight.y + 10}}
        for(let r of [leftFlan, rightFlan, tube]){
            const topLeft = Geometry.realToScreen(r.topLeft, realRect, screenRect);
            const bottomRight = Geometry.realToScreen(r.bottomRight, realRect, screenRect);
            const width = bottomRight.x - topLeft.x
            const height = bottomRight.y - topLeft.y
            let x = topLeft.x
            let y = topLeft.y
            ctx.strokeRect(x, y, width, height);
            }
    }
    getProperties(){
        return super.getProperties()
    }
    getSingleDimensionData(){

        return {hasDimension: true}
      }
}