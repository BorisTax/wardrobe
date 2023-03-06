import { jsPDF } from 'jspdf'
import TableShape from '../components/shapes/table/TableShape'
import RectangleShape from '../components/shapes/RectangleShape'
import { paint } from '../functions/drawFunctions';
import { getRealAndScreenRect, setDimensions, setTopLeft, zoomToRect } from '../functions/viewPortFunctions';
import Geometry from '../utils/geometry';
import { getWardrobePrintArea } from './panels';
import TextShape from '../components/shapes/table/TextShape';


export function printToPDF(appData, printState) {
    const doc = new jsPDF("l", 'px', 'a4');
    const scale = 2
    var canv = document.createElement('canvas')
    const pixels = 3// for 75 dpi   11.81 for 300 dpi
    const pageHeight = 210
    const pageWidth = 297
    var canvWidth = pageWidth * pixels * scale
    var canvHeight = pageHeight * pixels * scale
    canv.setAttribute("width", `${canvWidth}`)
    canv.setAttribute("height", `${canvHeight}`)
    canv.style.width = `${canvWidth/scale}px`
    canv.style.height = `${canvHeight/scale}px`

    var ctx = canv.getContext('2d')
    ctx.scale(scale, scale)
    const dims = appData.wardrobe
    const dataList = [
        [{ text: ['Спецификация:'], frame: false, align: 'left', weight: TextShape.BOLD }],
        [{ text: ['1. Габариты изделия (общий)'], frame: true, weight: TextShape.BOLD }],
        [{ text: [`  1.ширина: ${dims.width}`], frame: true, align: 'left' }],
        [{ text: [`  2.глубина: ${dims.depth}`], frame: true, align: 'left' }],
        [{ text: [`  3.высота: ${dims.height}`], frame: true, align: 'left' }],
        [{ text: [`2. Цвет ДСП`], frame: true, align: 'left', weight: TextShape.BOLD }],
        [{ text: [`  1.ДСП (корпус): ${"венге магия"}`], frame: true, align: 'left' }],
        [{ text: [`  2.ДСП (дополн):`], frame: true, align: 'left' }],
    ]

    const dataTable = new TableShape(dataList)

    const wardrobeRect = getWardrobePrintArea(appData)
    let viewPortData = appData.viewPortData
    viewPortData.viewPortWidth = canvWidth / scale
    viewPortData.viewPortHeight = canvHeight / scale
    viewPortData = zoomToRect({ topLeft: wardrobeRect.topLeft, bottomRight: wardrobeRect.bottomRight }, viewPortData)

    const fontSize = 12
    let { totalWidth: dataTableScreenWidth, totalHeight: dataTableScreenHeight } = dataTable.getTableDimensions(ctx, fontSize)
    dataTableScreenWidth = dataTableScreenWidth * 3
    const realWidth = viewPortData.realWidth
    const dataTableRealWidth = Geometry.screenToRealLength(dataTableScreenWidth, realWidth, viewPortData.viewPortWidth) 
    
    //viewPortData.viewPortWidth += dataTableScreenWidth
    //viewPortData.viewPortHeight = viewPortData.viewPortWidth / viewPortData.ratio
    viewPortData = setDimensions(viewPortData.viewPortWidth, viewPortData.viewPortHeight, realWidth + dataTableRealWidth, viewPortData)

    let { realRect, screenRect } = getRealAndScreenRect(viewPortData)

    const entireRect = { topLeft: { ...wardrobeRect.topLeft }, bottomRight: { ...wardrobeRect.bottomRight } }
    entireRect.bottomRight.x += dataTableRealWidth
    entireRect.bottomRight.y -= dataTableRealWidth / viewPortData.ratio
    viewPortData.bottomRight = entireRect.bottomRight
    viewPortData = zoomToRect({ topLeft: entireRect.topLeft, bottomRight: entireRect.bottomRight }, viewPortData)
    viewPortData = setTopLeft(wardrobeRect.topLeft, viewPortData)

    ;({ realRect, screenRect } = getRealAndScreenRect(viewPortData))
    for (let dimension of appData.dimensions) {
        dimension.setState({selected: appData.selectedPanels.has(dimension)})
        dimension.drawSelf(ctx, realRect, screenRect);
    }
    for (let shape of appData.panels) {
        shape.setState({selected: appData.selectedPanels.has(shape)})
        shape.drawSelf(ctx, realRect, screenRect);
    }
    const wardrobeOuterRect = new RectangleShape({...wardrobeRect})
    wardrobeOuterRect.drawSelf(ctx, realRect, screenRect)
    const dataTablePosition = { x: wardrobeRect.bottomRight.x, y: wardrobeRect.topLeft.y }
    const dataTableCanvasPosition = Geometry.realToScreen(dataTablePosition, realRect, screenRect)

    dataTable.setPosition(dataTableCanvasPosition.x, dataTableCanvasPosition.y)
    dataTable.draw(ctx, fontSize)
    var imgData = canv.toDataURL('image/png');
    const factor = 0.354 //подобрал чтобы вместилось на лист
    doc.addImage(imgData, 'PNG', 10, 10, canvWidth * factor-10, canvHeight * factor-10);


    window.open(doc.output('bloburl'), 'print-frame')
    //window.open(doc.output('bloburl'))
    //document.getElementById('printFrame').src=doc.output('bloburl')
    //doc.save("d:/a4.pdf");
}
