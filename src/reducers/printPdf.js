import TableShape from '../components/shapes/table/TableShape'
import { paint } from '../functions/drawFunctions';
import { setDimensions, setTopLeft, zoomToRect } from '../functions/viewPortFunctions';
import { getWardrobePrintArea } from './panels';
import TextShape from '../components/shapes/table/TextShape';
import { saveCurrentState } from './projectReducer';
import Geometry from '../utils/geometry';


export function exportProject(appData, printState) {
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
    let realWidth = wardrobeRect.bottomRight.x - wardrobeRect.topLeft.x
    viewPortData = setDimensions(viewPortData.viewPortWidth, viewPortData.viewPortHeight, realWidth, viewPortData)
    viewPortData = zoomToRect({ ...wardrobeRect }, viewPortData)
    viewPortData = setTopLeft(wardrobeRect.topLeft, viewPortData)

    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, viewPortData.viewPortWidth, viewPortData.viewPortHeight)
    dataTable.setPosition(0, 0)
    const fontSize = 12
    const marginRight = 20
    const marginTop = 50
    const {totalWidth} = dataTable.getTableDimensions(ctx, fontSize)
    ctx.save()
    ctx.translate(viewPortData.viewPortWidth - totalWidth - marginRight, marginTop)
    dataTable.draw(ctx, fontSize)
    ctx.restore()
    realWidth = Geometry.screenToRealLength(viewPortData.viewPortWidth - totalWidth - marginRight, viewPortData.realWidth, viewPortData.viewPortWidth)
    viewPortData = setDimensions(viewPortData.viewPortWidth - totalWidth - marginRight, viewPortData.viewPortHeight - 150, realWidth, viewPortData)
    viewPortData = zoomToRect({ ...wardrobeRect }, viewPortData)
    //viewPortData = setTopLeft(wardrobeRect.topLeft, viewPortData)
    ctx.save()
    ctx.translate(0, marginTop)
    paint(ctx, viewPortData, appData, true)
    ctx.restore()
    var imgData = canv.toDataURL('image/png');
    saveCurrentState(appData, imgData)
}

