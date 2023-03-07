import Geometry from '../../utils/geometry';
import Shape from "./Shape";
import PanelShape from './PanelShape';
import { PropertyTypes } from './PropertyData';
export default class DrawerBlockShape extends PanelShape {
    type = Shape.PANEL
    constructor(data) {
        super({ ...data, vertical: false, thickness: 423, name: "Ящичный блок" });
        this.properties = [
            {key: "name", type: PropertyTypes.STRING},
            {key: "drawerWidth", type: PropertyTypes.INTEGER_POSITIVE_NUMBER},
            {key: "depth", type: PropertyTypes.INTEGER_POSITIVE_NUMBER},
        ]
    }

    drawSelf(ctx, realRect, screenRect, print = false) {
        if (this.state.hidden) return
        this.refresh(realRect, screenRect);
        this.refreshStyle(ctx)
        if (this.state.selected || this.state.highlighted) { this.getStyle().setWidth(2) } else { this.getStyle().setWidth(1) }
        const distanceBetween = 37
        const bottomPanel = { x: this.rect.x, y: this.rect.y, last: { x: this.rect.last.x, y: this.rect.y + 16} }
        const bottomDrawer = { x: this.rect.x + 4, y: bottomPanel.last.y + distanceBetween, last: { x: this.rect.last.x - 4, y: bottomPanel.last.y + distanceBetween + 140 } }
        const topDrawer = { x: this.rect.x + 4, y: bottomDrawer.last.y + distanceBetween, last: { x: this.rect.last.x - 4, y: bottomDrawer.last.y + distanceBetween + 140 } }
        const topPanel = { x: this.rect.x, y: topDrawer.last.y + distanceBetween, last: { x: this.rect.last.x, y: this.rect.last.y} }
        for(let rect of [bottomPanel, bottomDrawer, topDrawer, topPanel]){   
            const topLeft = Geometry.realToScreen(rect, realRect, screenRect);
            const bottomRight = Geometry.realToScreen(rect.last, realRect, screenRect);
            const width = bottomRight.x - topLeft.x
            const height = bottomRight.y - topLeft.y
            let x = Math.trunc(topLeft.x) + 0.5
            let y = Math.trunc(topLeft.y) + 0.5
            ctx.strokeRect(x, y, width, height);
        }
    }
    getProperties(){
        const props = super.getProperties()
        props.find(p => p.key === "drawerWidth").value = this.length
        props.find(p => p.key === "depth").value = this.width - 50
        return props
    }
}