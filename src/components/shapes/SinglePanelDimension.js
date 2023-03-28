import Dimension from './Dimension';
export default class SinglePanelDimension extends Dimension {
    constructor(panel) {
        const {vertical, firstPoint, secondPoint} = panel.getSingleDimensionData()
        super({ vertical, firstPoint, secondPoint });
        this.panel = panel
    }
    draw(ctx, realRect, screenRect, print = false) {
        super.draw(ctx, realRect, screenRect, print)
    }
    refresh() {
        const { firstPoint, secondPoint } = this.panel.getSingleDimensionData()
        this.firstPoint = firstPoint
        this.secondPoint = secondPoint
        this.midPoint = { x: (this.firstPoint.x + this.secondPoint.x) / 2, y: (this.firstPoint.y + this.secondPoint.y) / 2 }
        super.refresh()

    }
    delete(){
        this.panel.dimensions.delete(this)
        this.panel.singleDimension = null
    }

}