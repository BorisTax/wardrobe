import { MouseHandler } from "./MouseHandler";
import { Status } from "../reducers/functions";
import { setCurCoord } from "../functions/viewPortFunctions";
import Geometry from "../utils/geometry";
import TwoPanelDimension from "../components/shapes/TwoPanelDimension";
import DimensionCursor from "../components/shapes/cursors/DimensionCursor";
export class TwoPanelDimensionCreateHandler extends MouseHandler {
    constructor(state, inside) {
        super(state);
        this.inside = inside
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
        if (this.clickCount < 1) appData.cursor.setType(DimensionCursor.ORD)
        switch (this.clickCount) {
            case 0:
            case 1: {
                for (let p of appData.panels) {
                    if (!p.state.selectable) continue;
                    if (p === this.firstPanel) continue
                    if (this.firstPanel && p.vertical !== this.firstPanel.vertical) continue
                    if (p.isUnderCursor(this.coord, viewPortData.pixelRatio)) {
                        p.setState({ highlighted: true })
                        appData.cursor.setType(p.vertical ? DimensionCursor.VERT : DimensionCursor.HOR)
                    } else {
                        p.setState({ highlighted: false })
                    }
                }
                break;
            }
            case 2: {
                const { midPoint } = TwoPanelDimension.getPoints(this.firstPanel, this.secondPanel, this.inside)
                const offset = this.curShape.vertical ? this.coord.x - midPoint.x : this.coord.y - midPoint.y
                const offsetPoint = this.curShape.vertical ? { x: midPoint.x + offset, y: midPoint.y } : { x: midPoint.x, y: midPoint.y + offset }
                this.curShape.setOffsetPoint(offsetPoint, offset)
                appData.cursor.setType(this.curShape.vertical ? DimensionCursor.VERT : DimensionCursor.HOR)
                break;
            }
            default: { }
        }
        setViewPortData(prevData => setCurCoord(this.coord, this.curPoint, prevData));

    }
    down({ button, curPoint, viewPortData, setViewPortData, appActions, appData, keys }) {
        super.down({ curPoint, viewPortData })
        setViewPortData(prevData => setCurCoord(this.coord, curPoint, prevData));
        if (button === 1 || button === 2) {
            appActions.setScreenStatus(Status.PAN, { startPoint: this.coord, prevStatus: Status.FREE, prevMouseHandler: this });
            return
        }
    }
    click({ button, curPoint, viewPortData, setViewPortData, appActions, appData, keys }) {
        super.click({ curPoint, viewPortData });
        if (button !== 0) return
        switch (this.clickCount) {
            case 1:
            case 2: {
                this.activePanel = null;
                this.firstPoint = this.coord
                for (let p of appData.panels) {
                    if (!p.state.selectable) continue;
                    if (p === this.firstPanel) continue
                    if (this.firstPanel && p.vertical !== this.firstPanel.vertical) continue
                    if (p.isUnderCursor(this.coord, viewPortData.pixelRatio)) {
                        this.activePanel = p;
                    }
                }

                if (this.activePanel) {
                    if (this.clickCount === 1) this.firstPanel = this.activePanel
                    if (this.clickCount === 2) {
                        this.secondPanel = this.activePanel
                        this.curShape = new TwoPanelDimension(this.firstPanel, this.secondPanel, this.inside)
                    }
                } else { this.clickCount = 0; this.firstPanel = null }
                break;
            }
            case 3: {
                this.firstPanel.dimensions.add(this.curShape)
                this.secondPanel.dimensions.add(this.curShape)
                appActions.addDimension(this.curShape)
                appActions.cancel()
                break;
            }
            default: { }
        }
    }
    doubleClick({ button, curPoint, viewPortData, setViewPortData, appActions, appData, keys }) {
        super.doubleClick({ curPoint, viewPortData })
        if (button === 0 && this.activePanel) {
            if (appData.material.texture) return;
            for (let panel of appData.panels) {
                panel.state.selected = (panel === this.activePanel)
            }
            appActions.repaint()
            return true;
        }
    }
    keypress(code) {
        return super.keypress(code)
    }
    up({ appActions }) {
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