import Dimension from './Dimension';
export default class SingleFasadeDimension extends Dimension {
    constructor(vertical, fasade) {
        const {firstPoint, secondPoint} = fasade.getSingleDimensionData(vertical)
        super({vertical, firstPoint, secondPoint });
        this.fasade = fasade
        this.vertical = vertical
    }
    draw(ctx, realRect, screenRect, print = false) {
        super.draw(ctx, realRect, screenRect, print)
    }
    refresh() {
        const { firstPoint, secondPoint } = this.fasade.getSingleDimensionData(this.vertical)
        this.firstPoint = firstPoint
        this.secondPoint = secondPoint
        this.midPoint = { x: (this.firstPoint.x + this.secondPoint.x) / 2, y: (this.firstPoint.y + this.secondPoint.y) / 2 }
        super.refresh()

    }
    delete(){
        this.fasade.dimensions.delete(this)
    }

}