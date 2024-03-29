import { MouseHandler } from "./MouseHandler";
import { PropertyTypes } from "../components/shapes/PropertyData";
import Geometry from "../utils/geometry";
import { Status } from "../reducers/functions";
import { setCurCoord } from "../functions/viewPortFunctions";
import { moveSelectedPanels, SelectionSet, setWardrobeDimensions } from "../reducers/panels";
import { WORKSPACE } from "../reducers/initialState";
import Shape from '../components/shapes/Shape' 
export class PanelMoveHandler extends MouseHandler {
    constructor(state, newPanel, movePoint) {
        super(state);
        this.movePoint = movePoint;
        this.properties = [
            { type: PropertyTypes.BOOL, value: false, labelKey: "make_copy", setValue: (value) => { this.makeCopy = value; } },
        ]
        if (!this.movePoint) {
            this.movePoint = {}
            this.movePoint.dx = (state.curShape.length + state.curShape.margin * 2) / 2
            this.movePoint.dy = (state.curShape.width + state.curShape.margin * 2) / 2
        }
        this.panels = state.panels
        this.activeShape = state.curShape
        let filterFunc
        switch (this.activeShape.type) {
            case Shape.DIMENSION:
                filterFunc = s => s.type === Shape.DIMENSION && s === this.activeShape
                break;
            default:
                filterFunc = s => s.type !== Shape.DIMENSION
                break;
        }
        state.selectedPanels = new SelectionSet(Array.from(state.selectedPanels).filter(filterFunc));
        this.newPanel = newPanel;
        if (this.newPanel) this.panels = [...state.panels, state.curShape];
        this.curShape = state.curShape;
        this.first = true;
        this.setStatusBar()
    }
    setStatusBar() {
        if (this.isMobile)
            this.statusBar = [{ text: ` - ${this.captions.scale}  `, icons: ["gest_zoom"] }];
        else
            this.statusBar = [{ text: ` - ${this.captions.rotate};  `, icons: ["rmb"] },
            { text: ` - ${this.captions.move};  `, icons: ["mmb"] },
            { text: ` - ${this.captions.scale};  `, icons: ["mmb_wheel"] },
            { text: ` - ${this.captions.snap}`, icons: ["button_ctrl"] }]
    }
    keypress(code) {
        return super.keypress(code)
    }
    down({ button, appActions, appData }) {
        if (button === 1) {
            appActions.setScreenStatus(Status.PAN, { startPoint: this.coord, prevStatus: Status.FREE, prevMouseHandler: this });
            return
        }
        if (button === 2) {

            return true;
        }
    }
    move({ curPoint, viewPortData, setViewPortData, appActions, appData, keys }) {
        if (!keys) keys = {}
        super.move({ curPoint, viewPortData });
        setViewPortData(prevData => setCurCoord(this.coord, this.curPoint, prevData))
        let p = Geometry.screenToReal(curPoint.x, curPoint.y, viewPortData.viewPortWidth, viewPortData.viewPortHeight, viewPortData.topLeft, viewPortData.bottomRight);
        p.x = p.x - this.movePoint.dx;
        p.y = p.y + this.movePoint.dy;

        p.x = Math.trunc(p.x);
        p.y = Math.trunc(p.y);
        var { x, y } = this.activeShape.getPosition();
        var [dx, dy] = [p.x - x, p.y - y];
        if (appData.workspace === WORKSPACE.CORPUS) moveSelectedPanels(dx, dy, this.activeShape, appData.selectedPanels, () => { setWardrobeDimensions(appData, appActions) })
        const dimensions = appData.workspace === WORKSPACE.CORPUS ? appData.dimensions : appData.fasadeDimensions
        for (const shape of dimensions) {
            if (!appData.selectedPanels.has(shape)) continue;
            shape.moveTo(dx, dy, appData.wardrobe)
        }
        this.lastPoint = { ...this.coord };
    }

    up({ button, curPoint, viewPortData, appActions, appData }) {
        super.click({ button, curPoint, viewPortData })
        if (button !== 0) return
        if (this.newPanel) {
            appData.curShape.state.selected = false;
            appActions.addShape(appData.curShape)
        }
        this.drag = false;
        appActions.cancel();
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
            this.move({ curPoint, viewPortData, setViewPortData, appActions, appData })
        }
    }
    touchUp({ pointerId, curPoint, viewPortData, appActions, appData }) {
        super.touchUp({ pointerId, viewPortData })
        const tm = viewPortData.touchManager
        if (tm.getTouchCount() === 0) this.up({ button: 0, curPoint, viewPortData, appActions, appData })
    }
    leave({ appActions }) {
        appActions.cancel()
    }
    click() {


    }
}