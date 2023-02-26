import ShapeStyle from '../components/shapes/ShapeStyle';
import { getRealRect, getScreenRect } from './viewPortFunctions'

export function paint(ctx, viewPortData, appData) {
    const color = "white"
    ctx.fillStyle = color;
    ctx.lineWidth = 1;
    ctx.lineJoin = 'round';
    ctx.fillRect(0, 0, viewPortData.viewPortWidth, viewPortData.viewPortHeight);
    const { topLeft, bottomRight, viewPortWidth, viewPortHeight, marginRight, marginTop, marginLeft, marginBottom } = viewPortData;
    const realRect = getRealRect(topLeft, bottomRight)
    const screenRect = getScreenRect(viewPortWidth, viewPortHeight)
    for (let dimension of appData.dimensions) {
        dimension.drawSelf(ctx, realRect, screenRect);
    }
    let curShape = appData.mouseHandler.curShape;
    if (curShape != null) curShape.drawSelf(ctx, realRect, screenRect);
    for (let shape of appData.panels) {
        shape.drawSelf(ctx, realRect, screenRect);
    }

    if (appData.curShape != null) appData.curShape.drawSelf(ctx, realRect, screenRect);
    ctx.lineWidth = 1;
    ctx.setLineDash(ShapeStyle.SOLID);
    ctx.fillStyle = color;
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
        appData.cursor.drawSelf(ctx, realRect, screenRect);
    }
    if (appData.mouseHandler.debugText) {
        ctx.font = `14px serif`;
        ctx.fillStyle = "red"
        ctx.fillText(appData.mouseHandler.debugText, 10, 100)
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