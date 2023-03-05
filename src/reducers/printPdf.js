import {jsPDF} from 'jspdf'
import TableShape from '../components/shapes/table/TableShape'
import { paint } from '../functions/drawFunctions';
import { getRealAndScreenRect, getRealRect, getScreenRect, setTopLeft, zoomToRect } from '../functions/viewPortFunctions';
import Geometry from '../utils/geometry';
import { getEntireRect } from './panels';


export function printToPDF(appData, printState){
    const doc = new jsPDF("l", 'px', 'a4');
    const scale = 2
    var canv = document.createElement('canvas')
    const pixels = 3// for 75 dpi   11.81 for 300 dpi
    const pageHeight = 210
    const pageWidth = 297
    var canvWidth = pageWidth*pixels*scale
    var canvHeight = pageHeight*pixels*scale
    canv.setAttribute("width", `${canvWidth}`)
    canv.setAttribute("height", `${canvHeight}`)
    canv.style.width = `${canvWidth/scale}px`
    canv.style.height = `${canvHeight/scale}px`

    var ctx=canv.getContext('2d')
    ctx.scale(scale, scale)
    const headerList = [
        [{text:['Заказ'],frame:true},{text:[''],frame:false,align:'left'}],
        [{text:['Дата:'],frame:true,align:'right'},{text:["12.12.12"],frame:false,align:'left'}],
        [{text:['План:'],frame:false,align:'right'},{text:["1234"],frame:false,align:'left'}],
        [{text:['Заказ:'],frame:false,align:'right'},{text:["12345"],frame:false,align:'left'}],
        [{text:['Материал:'],frame:false,align:'right'},{text:["qwerty"],frame:false,align:'left'}],
        [{text:['Плит:'],frame:false,align:'right'},{text:["1"],frame:false,align:'left'}],
    ]
    
    headerList.push([{text:[`head`],frame:false,align:'right'},{text:[`text`],frame:false,align:'left'}])
    
    const headTable = new TableShape(headerList)
    //const topMargin = 30
    //const leftMargin = 500
    //headTable.setPosition(leftMargin, topMargin)
    //ctx.strokeStyle = "black"
    const wardrobeRect = getEntireRect(appData)
    let viewPortData = appData.viewPortData
    viewPortData.viewPortWidth = canvWidth/4
    viewPortData.viewPortHeight = canvHeight/4
    viewPortData = zoomToRect({topLeft: wardrobeRect.topLeft, bottomRight: wardrobeRect.bottomRight}, appData.viewPortData)
    
    const { totalWidth, totalHeight } = headTable.getTableDimensions(ctx, fontSize)
    //viewPortData.viewPortWidth += totalWidth
    const realWidth = viewPortData.bottomRight.x - viewPortData.topLeft.x
    const totalRealWidth = Geometry.screenToRealLength(totalWidth, realWidth, viewPortData.viewPortWidth)
    
    const tablePosition = {x: wardrobeRect.bottomRight.x, y: wardrobeRect.topLeft.y}
    const {realRect, screenRect} = getRealAndScreenRect(viewPortData)
    const tableCanvasPosition = Geometry.realToScreen(tablePosition, realRect, screenRect)
    //viewPortData.topLeft = wardrobeRect.topLeft
    //viewPortData.bottomRight = entireRect.bottomRight
    const entireRect = {topLeft: {...wardrobeRect.topLeft}, bottomRight: {...wardrobeRect.bottomRight}}
    //entireRect.bottomRight.x += totalRealWidth
    //viewPortData = zoomToRect({topLeft: entireRect.topLeft, bottomRight: entireRect.bottomRight}, appData.viewPortData)
    viewPortData = setTopLeft(wardrobeRect.topLeft, viewPortData)
    paint(ctx, viewPortData, appData, true)
    const fontSize = 10
    headTable.setPosition(viewPortData.viewPortWidth-1, tableCanvasPosition.y)
    headTable.draw(ctx,fontSize)
    var imgData = canv.toDataURL('image/png');
    console.log(imgData)
    //return {imgData, doc, width: canvWidth / scale, height: canvHeight /scale}
    doc.addImage(imgData, 'PNG', 10, 10, canvWidth / scale, canvHeight /scale);
 

   window.open(doc.output('bloburl'),'print-frame')
   //window.open(doc.output('bloburl'))
   //document.getElementById('printFrame').src=doc.output('bloburl')
    //doc.save("d:/a4.pdf");
}
