import Geometry from '../utils/geometry.js';
import ShapeStyle from '../components/shapes/ShapeStyle';
import {Color} from '../components/colors';
import { getRealRect, getScreenRect } from './viewPortFunctions'

function drawGrid(ctx, {gridStep, topLeft, viewPortHeight}, realRect, screenRect, appData, zeroX){
        ctx.strokeStyle = Color.LIGHT_GRAY;
        let solidStyle = ShapeStyle.GRID_STYLE_SOLID
        let dashStyle = ShapeStyle.GRID_STYLE_DASH
        let firstX = 0;
        let firstY = 0;
        let hor = false;
        let vert = false;
        let ix = 0;
        let iy = 0;
        let xGridLineNumber = Math.trunc(firstX / gridStep);
        let yGridLineNumber = Math.trunc(firstY / gridStep);
        let gridLinesCountX = Math.trunc(2800 / gridStep);
        let gridLinesCountY = Math.trunc( 2000 / gridStep);
        const gridPointsX = new Array(gridLinesCountX);
        const gridPointsY = new Array(gridLinesCountY);
        const gridNumbersX = new Array(gridLinesCountX);
        const gridNumbersY = new Array(gridLinesCountY);
        while(!hor || !vert){
            let x = firstX + gridStep * ix;
            let y = firstY - gridStep * iy;
            if(y < - 2000 + 50) {vert = true};
            if(x > 2750) hor = true;
            if(!hor){
                let px = Geometry.realToScreen({x, y: topLeft.y}, realRect, screenRect);
                if(xGridLineNumber % 10 === 0) ctx.setLineDash(solidStyle.getStroke());else ctx.setLineDash(dashStyle.getStroke());
                ctx.setLineDash(solidStyle.getStroke())
                ctx.strokeStyle = Color.LIGHT_GRAY;
                ctx.beginPath();
                ctx.moveTo(px.x + 0.5, 0 + 0.5);
                ctx.lineTo(px.x + 0.5, viewPortHeight + 0.5);
                ctx.stroke();
                gridPointsX[ix] = px.x;
                gridNumbersX[ix] = x;
                ix++;
                xGridLineNumber++;
            }
            
            if(!vert){
                let py = Geometry.realToScreen({x: topLeft.x, y}, realRect, screenRect);
                if(yGridLineNumber % 10 === 0) ctx.setLineDash(solidStyle.getStroke());else ctx.setLineDash(dashStyle.getStroke());
                ctx.setLineDash(solidStyle.getStroke())
                yGridLineNumber--;
                if((y % 2000) > -1300) {
                    ctx.beginPath();
                    ctx.strokeStyle = Color.GRAY;
                    ctx.moveTo(zeroX - 10, py.y + 0.5);
                    ctx.lineTo(zeroX, py.y + 0.5);
                    ctx.stroke();
                }
                gridPointsY[iy] = py.y;
                gridNumbersY[iy] = y % 2000 > -1300 ? Math.abs(y % 2000) : "";
                iy++
            }
        }
        ctx.setLineDash(solidStyle.getStroke());
        return {gridNumbersX, gridNumbersY, gridPointsX, gridPointsY}
    }

function drawCoordinatesX(ctx, {viewPortWidth, gridStep, gridStepPixels, marginRight, marginLeft, marginTop},  gridPointsX, gridNumbersX, zeroY ){
        ctx.font = "10px sans-serif";
        ctx.strokeStyle = "black";
        let i = 0;
        let format = 0;
        let w;
        if(gridStep >= 0.001){format = 3;}
        if(gridStep >= 0.01){format = 2;}
        if(gridStep >= 0.1){format = 1;}
        if(gridStep >= 1){format = 0;}
        let l = 0;
        let s0 = "";//Finding out the number with maximum length
        for(let x of gridNumbersX){
            if(!x) continue;
             let s = x.toFixed(format);
            if(l < s.length){s0 = s; l = s.length;}
            }
        w = ctx.measureText(s0).width;
        for(let x of gridPointsX){
            if(!x && x !== 0) continue;
            if(x > marginLeft && x < viewPortWidth - marginRight) {
                 let s = gridNumbersX[i].toFixed(format);
                 let d = 1;
                 let r = w / gridStepPixels;
                 if(r >= 1)d = 2;
                 if(r >= 1.5)d = 5;
                 if(Math.trunc(gridNumbersX[i] / gridStep) % d === 0)
                    ctx.strokeText(s, x - ctx.measureText(s).width / 2, zeroY - 8);
            }
            i++;
        }

    }

function drawCoordinatesY(ctx, {viewPortHeight, marginBottom, marginTop}, gridPointsY, gridNumbersY, zeroX){
        ctx.font = "10px sans-serif";
        ctx.strokeStyle = "black";
        let i = 0;
        let w;
        for(let y of gridPointsY){
            if(!y && y!==0) continue;
            if(y > marginTop && y < viewPortHeight - marginBottom){
                let s = gridNumbersY[i];
                w = ctx.measureText(s).width;
                let h = ctx.measureText("12").width;
                ctx.strokeText(s, zeroX - w - 10, y + h / 3);
                }
             i++;
        }
    }

export function paint(ctx, viewPortData, appData){
        const color = "white"
        ctx.fillStyle = color;
        ctx.lineWidth = 1;
        ctx.lineJoin = 'round';
        ctx.fillRect(0, 0, viewPortData.viewPortWidth, viewPortData.viewPortHeight);
        const {topLeft, bottomRight, viewPortWidth, viewPortHeight, marginRight, marginTop, marginLeft, marginBottom} = viewPortData;
        const realRect = getRealRect(topLeft, bottomRight)
        const screenRect = getScreenRect(viewPortWidth, viewPortHeight)
        const zeroX = Geometry.realToScreen({x:0,y:0}, realRect, screenRect).x
        const {gridNumbersX, gridNumbersY, gridPointsX, gridPointsY} = drawGrid(ctx, viewPortData, realRect, screenRect, appData, zeroX);

        drawCoordinatesY(ctx, viewPortData,  gridPointsY, gridNumbersY, zeroX);
        for(let shape of appData.panels){
                shape.drawSelf(ctx, realRect, screenRect);
            }
        let curShape = appData.mouseHandler.curShape;
        if(curShape != null) curShape.drawSelf(ctx, realRect, screenRect);
        if(appData.curShape != null) appData.curShape.drawSelf(ctx, realRect, screenRect);
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
        if(!appData.isMobile && appData.mouseHandler.mouseOnScreen) {
            appData.cursor.setPosition(viewPortData.curRealPoint);
            appData.cursor.drawSelf(ctx, realRect, screenRect);
        }
        if(appData.mouseHandler.debugText){
            ctx.font=`14px serif`;
            ctx.fillStyle = "red"
            ctx.fillText(appData.mouseHandler.debugText, 10, 100)
        }

    }

