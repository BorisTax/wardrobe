import { MouseHandler } from "./MouseHandler";
import { Status } from "../reducers/functions";
import { setCurCoord } from "../functions/viewPortFunctions";
import Geometry from "../utils/geometry";
import SingleFasadeDimension from "../components/shapes/SingleFasadeDimension";
import DimensionCursor from "../components/shapes/cursors/DimensionCursor";
export class SingleFasadeDimensionCreateHandler extends MouseHandler {
    constructor(state, vertical) {
        super(state);
        this.vertical = vertical
        this.setStatusBar()
    }
    setStatusBar() {
        if (this.isMobile)
            this.statusBar = [{ text: ` - ${this.captions.move};  `, icons: ["gest_move"] },
            { text: ` - ${this.captions.rotate};  `, icons: ["gest_dbltap"] },
            { text: ` - ${this.captions.scale}  `, icons: ["gest_zoom"] }
            ];
        else
            this.statusBar = [{ text: ` - ${this.captions.move};  `, icons: ["rmb", "mmb"] },
            { text: ` - ${this.captions.scale}  `, icons: ["mmb_wheel"] }
            ];
    }
    move({ curPoint, viewPortData, setViewPortData, appActions, appData, keys }) {
        super.move({ curPoint, viewPortData });
        appData.cursor.setType(this.vertical ? DimensionCursor.VERT : DimensionCursor.HOR)
        switch (this.clickCount) {
            case 0: {
                for (let p of appData.fasades) {
                    if (!p.state.selectable) continue;
                    if (p.isUnderCursor(this.coord, viewPortData.pixelRatio)) {
                        p.setState({ highlighted: true })
                        
                    } else {
                        p.setState({ highlighted: false })

                    }
                }
                break;
            }
            case 1: {
                const offset = this.vertical ? this.coord.x - this.firstPoint.x : this.coord.y - this.firstPoint.y
                //const { midPoint } = TwoPanelDimension.getPoints(this.activePanel, this.activePanel)
                const offsetPoint = this.vertical ? { x: this.midPoint.x + offset, y: this.midPoint.y } : { x: this.midPoint.x, y: this.midPoint.y + offset }
                this.curShape.setOffsetPoint(offsetPoint, appData.wardrobe)
                break;
            }
            default: { }
        }
        setViewPortData(prevData => setCurCoord(this.coord, this.curPoint, prevData));

    }
    down({ button, curPoint, viewPortData, setViewPortData, appActions, appData, keys }) {
        super.down({ curPoint, viewPortData })
        setViewPortData(prevData => setCurCoord(this.coord, curPoint, prevData));
        if (button === 1) {
            appActions.setScreenStatus(Status.PAN, { startPoint: this.coord, prevStatus: Status.FREE, prevMouseHandler: this });
            return
        }
    }
    click({ button, curPoint, viewPortData, setViewPortData, appActions, appData, keys }) {
        super.click({ curPoint, viewPortData });
        if (button !== 0) return
        switch (this.clickCount) {
            case 1: {
                this.activePanel = null;
                //this.firstPoint = this.coord
                for (let p of appData.fasades) {
                    if (!p.state.selectable) continue;
                    if (p.isUnderCursor(this.coord, viewPortData.pixelRatio)) {
                        this.activePanel = p;
                        const { firstPoint, secondPoint, midPoint } = p.getSingleDimensionData(this.vertical)
                        this.firstPoint = firstPoint
                        this.secondPoint = secondPoint
                        this.midPoint = midPoint
                        this.curShape = new SingleFasadeDimension(this.vertical, p)
                    }
                }
                if (!this.activePanel) this.clickCount = 0
                break;
            }
            case 2: {
                this.activePanel.dimensions.add(this.curShape)
                appActions.addFasadeDimension(this.curShape)
                appActions.cancel()
                break;
            }
            default: { }
        }
    }
    doubleClick({ button, curPoint, viewPortData, setViewPortData, appActions, appData, keys }) {
        super.doubleClick({ curPoint, viewPortData })
        if (button === 0 && this.activePanel) {
            for (let panel of appData.fasades) {
                panel.state.selected = (panel === this.activePanel)
            }
            appActions.repaint()
            return true;
        }
    }
    keypress(code) {
        return super.keypress(code)
    }
    up({ button, appActions }) {
        if (button === 2) return appActions.cancel()
        this.drag = false;
        appActions.updateState()
    }
    getSelectedShapeProperties(state) {
        this.properties = [];
        const shape = state.selectionManager.getSelectedPanels().pop();
        if (shape) {
            const props = shape.getProperties();
            this.setProperties(props);
            this.currentObject = shape;
        }
    }

    touchDown({ pointerId, curPoint, viewPortData, setViewPortData, appActions, appData }) {
        super.touchDown({ pointerId, curPoint, viewPortData })
        this.down({ button: 0, curPoint, viewPortData, setViewPortData, appActions, appData })
    }
    touchMove({ pointerId, curPoint, viewPortData, setViewPortData, appActions, appData }) {
        super.touchMove({ pointerId, curPoint, viewPortData })
        const tm = viewPortData.touchManager
        if (tm.getTouchCount() > 1) {
            const diff = Geometry.distance(tm.touches[0].curPoint, tm.touches[1].curPoint)
            const midPoint = Geometry.midPoint(tm.touches[0].curPoint, tm.touches[1].curPoint)
            const delta = tm.prevDiff - diff
            if (Math.abs(delta) > 10) {
                const deltaY = Math.sign(delta)
                this.wheel({ deltaY, curPoint: midPoint, viewPortData, setViewPortData })
                tm.prevDiff = diff
            }
        }
        if (tm.getTouchCount() === 1) {
            if (this.drag) {
                appData.panels.forEach(p => p.state.selected = false)
                this.activePanel.state.selected = true
                appActions.movePanel(this.activePanel, this.dragPos);
                return;
            }
            appActions.setScreenStatus(Status.PAN, { startPoint: this.coord, prevStatus: Status.FREE, prevMouseHandler: this })
        }
    }
}