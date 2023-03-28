import ShapeStyle from '../components/shapes/ShapeStyle';
import { WORKSPACE } from '../reducers/initialState';
import { getRealRect, getScreenRect } from './viewPortFunctions'

export function paint(ctx, viewPortData, appData, print = false) {
    const color = "white"
    ctx.fillStyle = color;
    ctx.lineWidth = 1;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = "black"
    ctx.fillRect(0, 0, viewPortData.viewPortWidth, viewPortData.viewPortHeight);
    //ctx.strokeRect(0, 0, viewPortData.viewPortWidth-1, viewPortData.viewPortHeight-1);
    const { topLeft, bottomRight, viewPortWidth, viewPortHeight, marginRight, marginTop, marginLeft, marginBottom } = viewPortData;
    const realRect = getRealRect(topLeft, bottomRight)
    const screenRect = getScreenRect(viewPortWidth, viewPortHeight)
    const [panels, dimensions] = (appData.workspace === WORKSPACE.CORPUS) ? [appData.panels, appData.dimensions] : [appData.fasades, appData.fasadeDimensions]
    
    for (let dimension of dimensions) {
        //dimension.setState({selected: appData.selectedPanels.has(dimension)})
        dimension.draw(ctx, realRect, screenRect, print);
    }
    for (let shape of panels) {
        //shape.setState({selected: appData.selectedPanels.has(shape)})
        if(!shape.hasChildren() || appData.selectedPanels.has(shape) || shape.level === 0) shape.draw(ctx, realRect, screenRect, print, appData.captions);
    }
    let curShape = appData.mouseHandler.curShape;
    if (curShape != null) curShape.draw(ctx, realRect, screenRect);
    if (appData.curShape != null) appData.curShape.draw(ctx, realRect, screenRect);
    ctx.lineWidth = 1;
    ctx.setLineDash(ShapeStyle.SOLID);
    ctx.fillStyle = color;
    if(print) return
    //fill margin
    ctx.fillRect(0, 0, viewPortWidth - marginRight, marginTop);
    ctx.fillRect(0, 0, marginLeft, viewPortHeight);
    ctx.fillRect(viewPortWidth - marginRight, 0, viewPortWidth, viewPortHeight);
    ctx.fillRect(marginLeft, viewPortHeight - marginBottom, viewPortWidth - marginRight, viewPortHeight - marginTop);
    ctx.strokeStyle = "black";
    ctx.strokeRect(marginLeft, marginTop, viewPortWidth - marginRight - marginLeft, viewPortHeight - marginBottom - marginTop);

    ctx.lineWidth = 1;
    if (!appData.isMobile && appData.mouseHandler.mouseOnScreen) {
        appData.cursor.setPosition(viewPortData.curRealPoint);
        appData.cursor.draw(ctx, realRect, screenRect);
    }

}

export function drawArrow(ctx, vertical, position, arrowSize, arrowTipPixels) {
    const {x ,y} = position
    let arrow = arrowTipPixels
    const size = arrowSize / 2
    if (!vertical) {
        ctx.moveTo(x - size + 0.5, y + 0.5);
        ctx.lineTo(x + size + 0.5, y + 0.5);
        ctx.moveTo(x - size + 0.5, y + 0.5);
        ctx.lineTo(x - size + 0.5 + arrow, y + 0.5 - arrow);
        ctx.moveTo(x - size + 0.5, y + 0.5);
        ctx.lineTo(x - size + 0.5 + arrow, y + 0.5 + arrow);
        ctx.moveTo(x + size + 0.5, y + 0.5);
        ctx.lineTo(x + size + 0.5 - arrow, y + 0.5 - arrow);
        ctx.moveTo(x + size + 0.5, y + 0.5);
        ctx.lineTo(x + size + 0.5 - arrow, y + 0.5 + arrow);
    } else {
        ctx.moveTo(x + 0.5, y - size + 0.5);
        ctx.lineTo(x + 0.5, y + size + 0.5);
        ctx.moveTo(x + 0.5, y - size + 0.5);
        ctx.lineTo(x + 0.5 - arrow, y - size + 0.5 + arrow);
        ctx.moveTo(x + 0.5, y - size + 0.5);
        ctx.lineTo(x + 0.5 + arrow, y - size + 0.5 + arrow);
        ctx.moveTo(x + 0.5, y + size + 0.5);
        ctx.lineTo(x + 0.5 - arrow, y + size + 0.5 - arrow);
        ctx.moveTo(x + 0.5, y + size + 0.5);
        ctx.lineTo(x + 0.5 + arrow, y + size + 0.5 - arrow);
    }
}