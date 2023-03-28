import Geometry from '../../utils/geometry';
import Shape from "./Shape";
import PanelShape from './PanelShape';
import { PropertyTypes } from './PropertyData';
export default class DrawerShape extends PanelShape {
    type = Shape.DRAWER
    constructor(data) {
        super({ ...data, vertical: false, thickness: 140, panelMargin: 10, name: "Ящик" });
        this.state.measurable = false
        this.properties = [
            {key: "name", type: PropertyTypes.STRING},
            {key: "drawerWidth", type: PropertyTypes.INTEGER_POSITIVE_NUMBER},
            {key: "depth", type: PropertyTypes.INTEGER_POSITIVE_NUMBER},
        ]
    }

    draw(ctx, realRect, screenRect, print = false) {
        if (this.state.hidden) return
        this.refresh(realRect, screenRect);
        this.refreshStyle(ctx)
        if (this.state.selected || this.state.highlighted) { this.getStyle().setWidth(2) } else { this.getStyle().setWidth(1) }
        const rect = { x: this.rect.x + 4, y: this.rect.y, last: { x: this.rect.last.x - 4, y: this.rect.last.y } }
        const topLeft = Geometry.realToScreen(rect, realRect, screenRect);
        const bottomRight = Geometry.realToScreen(rect.last, realRect, screenRect);
        const width = bottomRight.x - topLeft.x
        const height = bottomRight.y - topLeft.y
        let x = topLeft.x
        let y = topLeft.y
        ctx.strokeRect(x, y, width, height);
    }
    getProperties(){
        const props = super.getProperties()
        props.find(p => p.key === "drawerWidth").value = this.length
        props.find(p => p.key === "depth").value = this.width - 50
        return props
    }
    getSingleDimensionData(){

        return {hasDimension: false}
      }
}