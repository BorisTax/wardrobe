import {jsPDF} from 'jspdf'

import TableShape from '../components/shapes/table/TableShape'
import { paint } from '../functions/drawFunctions';
import { zoomToRect } from '../functions/viewPortFunctions';


export function printToPDF(appData, printState){
    const doc = new jsPDF("l", 'px', 'a4');
    const scale = 2
    const pixelScale = 1
    const fontSize = 14
    var canv = document.createElement('canvas')
    const pixels = 11.81 / pixelScale
    const pageHeight = 210
    const pageWidth = 297
    var canvWidth = pageWidth*pixels*scale
    var canvHeight = pageHeight*pixels*scale
    canv.setAttribute("width", `${canvWidth}`)
    canv.setAttribute("height", `${canvHeight}`)
    canv.style.width = `${canvWidth/scale}px`
    canv.style.height = `${canvHeight/scale}px`
    const maxCanvHeight =  canvHeight / scale - (canvHeight / scale ) % 50 
    //const maxCanvWidth =  canvWidth / scale - (canvWidth / scale ) % 50 
    var ctx=canv.getContext('2d')
    ctx.scale(scale,scale)
    const viewPortData = zoomToRect({topLeft: {x: -400, y: 2800}, bottomRight: {x: 3500, y: -400}}, appData.viewPortData)
    paint(ctx, viewPortData, appData, true)
    // const headerList = [
    //                     [{text:[''],frame:false},{text:['Накладная на передачу деталей в раскрой'],frame:false,align:'left'}],
    //                     [{text:['Дата:'],frame:false,align:'right'},{text:"12.12.12",frame:false,align:'left'}],
    //                     [{text:['План:'],frame:false,align:'right'},{text:"1234",frame:false,align:'left'}],
    //                     [{text:['Заказ:'],frame:false,align:'right'},{text:"12345",frame:false,align:'left'}],
    //                     [{text:['Материал:'],frame:false,align:'right'},{text:"qwerty",frame:false,align:'left'}],
    //                     [{text:['Плит:'],frame:false,align:'right'},{text:"1",frame:false,align:'left'}],
    //                   ]

    // headerList.push([{text:[`head`],frame:false,align:'right'},{text:[`text`],frame:false,align:'left'}])

    // const headTable = new TableShape(headerList)
    const topMargin = 30
    const leftMargin = 20
    //headTable.setPosition(leftMargin, topMargin)
    //const { totalHeight } = headTable.getTableDimensions(ctx, fontSize)
    //if(ctx)ctx.fillStyle = "white"
    //ctx.clearRect(0,0,canvWidth,canvHeight);
    //headTable.draw(ctx,fontSize)
    var imgData = canv.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 10, 10, canvWidth / 3-30, canvHeight / 3-30);
 

   window.open(doc.output('bloburl'),'print-frame')
   //window.open(doc.output('bloburl'))
   //document.getElementById('printFrame').src=doc.output('bloburl')
    //doc.save("d:/a4.pdf");
}




  