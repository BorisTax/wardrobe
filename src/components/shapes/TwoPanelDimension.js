import Dimension from './Dimension';
export default class TwoPanelDimension extends Dimension {
    constructor(panel1, panel2, inside) {
        super({ vertical: !panel1.vertical, ...TwoPanelDimension.getPoints(panel1, panel2, inside) });
        this.panel1 = panel1
        this.panel2 = panel2
        this.inside = inside
    }
    draw(ctx, realRect, screenRect, print = false) {
        super.draw(ctx, realRect, screenRect, print)
    }
    refresh() {
        ({ firstPoint: this.firstPoint, secondPoint: this.secondPoint, midPoint: this.midPoint } = TwoPanelDimension.getPoints(this.panel1, this.panel2, this.inside))
        super.refresh()

    }
    delete(){
        this.panel1.dimensions.delete(this)
        this.panel2.dimensions.delete(this)
    }
    static getPoints(panel1, panel2, inside) {
        const vert = panel1.vertical
        const firstPoint = {}
        const secondPoint = {}
        let [p1, p2] = [panel1, panel2]
        if (vert) {
            if (panel1.rect.x > panel2.rect.x) ([p1, p2] = [panel2, panel1])
            firstPoint.x = inside ? p1.rect.last.x : p1.rect.x
            firstPoint.y = (p1.rect.last.y + p1.rect.y) / 2
            secondPoint.x = inside ? p2.rect.x : p2.rect.last.x
            secondPoint.y = (p2.rect.last.y + p2.rect.y) / 2
        } else {
            if (panel1.rect.y > panel2.rect.y) ([p1, p2] = [panel2, panel1])
            firstPoint.x = (p1.rect.last.x + p1.rect.x) / 2
            firstPoint.y = inside ? p1.rect.last.y : p1.rect.y
            secondPoint.x = (p2.rect.last.x + p2.rect.x) / 2
            secondPoint.y = inside ? p2.rect.y : p2.rect.last.y
        }
        const midPoint = { x: (firstPoint.x + secondPoint.x) / 2, y: (firstPoint.y + secondPoint.y) / 2 }
        return { firstPoint, secondPoint, midPoint }
    }
}