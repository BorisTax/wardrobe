import { jsPDF } from 'jspdf'
import TableShape from '../components/shapes/table/TableShape'
import { paint } from '../functions/drawFunctions';
import { setDimensions, zoomToRect } from '../functions/viewPortFunctions';
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
    const captions = appData.captions.print.dataTable
    const double = appData.wardrobe.double ? captions.double : captions.single 
    const materials = appData.materials
    const dataList = [
        [{ text: [captions.title], frame: false, align: 'left', weight: TextShape.BOLD }],
        [{ text: [captions.gabarits], frame: true, weight: TextShape.BOLD }],
        [{ text: [`  ${captions.width} ${dims.width} ${double}`], frame: true, align: 'left' }],
        [{ text: [`  ${captions.depth} ${dims.depth}`], frame: true, align: 'left' }],
        [{ text: [`  ${captions.height} ${dims.height}`], frame: true, align: 'left' }],
        [{ text: [captions.DSPcolor], frame: true, align: 'left', weight: TextShape.BOLD }],
        [{ text: [`  ${captions.DSPcorpus} ${materials.DSPColors[materials.activeDSPColorIndex].name}`], frame: true, align: 'left' }],
        [{ text: [`  ${captions.DSPext}`], frame: true, align: 'left' }],
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
    const ratio = totalWidth / totalHeight
    const dataTableScale = 3
    doc.addImage(imgData, 'PNG', canvWidth * factor + marginLeft, marginTop, totalWidth * dataTableScale, totalHeight * dataTableScale / ratio);

    window.open(doc.output('bloburl'), 'print-frame')
    //window.open(doc.output('bloburl'))
    //document.getElementById('printFrame').src=doc.output('bloburl')
    //doc.save("d:/a4.pdf");
}
