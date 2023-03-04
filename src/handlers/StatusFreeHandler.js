import { MouseHandler } from "./MouseHandler";
import SelectCursor from "../components/shapes/cursors/SelectCursor";
import { Status } from "../reducers/functions";
import { setCurCoord } from "../functions/viewPortFunctions";
import Geometry from "../utils/geometry";
import ResizeCursor from "../components/shapes/cursors/ResizeCursor";
export class StatusFreeHandler extends MouseHandler {
    constructor(state) {
        super(state);
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
        if (this.drag) {
            //if (!keys.shiftKey) appData.selectedPanels = new Set()
            appData.selectedPanels.add(this.activeShape)
            if (!this.activeShape.state.fixed) appActions.movePanel(this.activeShape, this.dragPos);
            return;
        } else {
            this.activeShape = null;
            for (let p of [...appData.panels, ...appData.dimensions]) {
                if (!p.state.selectable) continue;
                if (p.isUnderCursor(this.coord, viewPortData.pixelRatio)) {
                    if (!p.state.fixed) appActions.setCursor(new ResizeCursor(this.coord, p.vertical));
                    p.setState({ highlighted: true })
                    this.activeShape = p;
                } else {
                    p.setState({ highlighted: false })
                }
            }
            if (!this.activeShape) appActions.setCursor(new SelectCursor(this.coord));
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
        if (button !== 0) return
        this.activeShape = null;
        for (let p of [...appData.panels, ...appData.dimensions]) {
            if (!p.state.selectable) continue;
            if (p.isUnderCursor(this.coord, viewPortData.pixelRatio)) {
                this.activeShape = p;
            } else {
                //p.setState({ selected: false })
            }
        }
        this.drag = false;
        if (this.activeShape) {
            const { x, y } = this.activeShape.getPosition()
            const dx = this.coord.x - x;
            const dy = y - this.coord.y;
            this.drag = true;
            this.dragPos = { dx, dy }
        } else
        if (!appData.isMobile) { appActions.startSelection(this.coord) }
    }
    click({ button, curPoint, viewPortData, setViewPortData, appActions, appData, keys }) {
        super.click({ curPoint, viewPortData });
        if (button !== 0) return
        if (button !== 0) return
        for (let p of [...appData.panels, ...appData.dimensions]) {
            if (p.isUnderCursor(this.coord, viewPortData.pixelRatio)) {
                if (keys.shiftKey) {
                    if(appData.selectedPanels.has(p)) appData.selectedPanels.delete(p);
                            else appData.selectedPanels.add(p)
                } else {
                    appData.selectedPanels.add(p)
                }
            } else {
                if (!keys.shiftKey) {
                    appData.selectedPanels.delete(p)
                }
            }
        }
        appActions.updateState()
    }
    doubleClick({ button, curPoint, viewPortData, setViewPortData, appActions, appData, keys }) {
        super.doubleClick({ curPoint, viewPortData })

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
                this.activeShape.state.selected = true
                appActions.movePanel(this.activeShape, this.dragPos);
                return;
            }
            appActions.setScreenStatus(Status.PAN, { startPoint: this.coord, prevStatus: Status.FREE, prevMouseHandler: this })
        }
    }
}