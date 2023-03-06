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
    canv.style.width = `${canvWidth / scale}px`
    canv.style.height = `${canvHeight / scale}px`

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
    const realWidth = wardrobeRect.bottomRight.x - wardrobeRect.topLeft.x
    viewPortData = setDimensions(viewPortData.viewPortWidth, viewPortData.viewPortHeight, realWidth, viewPortData)
    viewPortData = zoomToRect({ ...wardrobeRect }, viewPortData)
    paint(ctx, viewPortData, appData, true)

    var imgData = canv.toDataURL('image/png');
    const factor = 0.25
    const marginTop = 30
    const marginLeft = 10
    doc.addImage(imgData, 'PNG', marginLeft, marginTop, canvWidth * factor, canvHeight * factor);

    ctx.clearRect(0, 0, viewPortData.viewPortWidth, viewPortData.viewPortHeight)
    dataTable.setPosition(0, 0)
    const fontSize = 12
    dataTable.draw(ctx, fontSize)
    imgData = canv.toDataURL('image/png');
    const {totalWidth, totalHeight} = dataTable.getTableDimensions(ctx, fontSize)
    doc.addImage(imgData, 'PNG', canvWidth * factor + marginLeft, marginTop, totalWidth * 5, totalHeight * 4.5);

    window.open(doc.output('bloburl'), 'print-frame')
    //window.open(doc.output('bloburl'))
    //document.getElementById('printFrame').src=doc.output('bloburl')
    //doc.save("d:/a4.pdf");
}
