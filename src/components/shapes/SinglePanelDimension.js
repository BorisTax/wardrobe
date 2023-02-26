import Dimension from './Dimension';
export default class SinglePanelDimension extends Dimension {
    constructor(panel) {
        const firstPoint = panel.rect
        const secondPoint = panel.rect.last
        super({vertical: panel.vertical, firstPoint, secondPoint});
        this.panel = panel
    }
    drawSelf(ctx, realRect, screenRect, print = false){
        super.drawSelf(ctx, realRect, screenRect, print)
    }
    refresh() {
        this.firstPoint = this.panel.rect
        this.secondPoint = this.panel.rect.last
        super.refresh()
        
    }

}