import { MouseHandler } from "./MouseHandler";
import { PropertyTypes } from "../components/shapes/PropertyData";
import Geometry from "../utils/geometry";
import { Status } from "../reducers/functions";
import { setCurCoord } from "../functions/viewPortFunctions";
import DragCursor from "../components/shapes/cursors/DragCursor";
export class PanelCreateHandler extends MouseHandler {
    constructor(state) {
        super(state);
        this.movePoint = { dx: 0, dy: 0 };
        this.properties = [
            { type: PropertyTypes.BOOL, value: false, labelKey: "make_copy", setValue: (value) => { this.makeCopy = value; } },
        ]

        this.panels = state.panels
        this.activeShape = state.curShape
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
        if (button === 2 && this.countSelected < 2) {

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
        this.canBePlaced = this.activeShape.canBePlaced(p.x, p.y, appData.panels, appData.wardrobe)
        if (this.canBePlaced) {
            const res = this.activeShape.findDimensions(p.x, p.y, appData.panels, appData.wardrobe)
            this.canBePlaced = (this.activeShape.length >= this.activeShape.minLength)
            this.canBePlaced = res
        }
        this.activeShape.setHidden(!this.canBePlaced)
        appData.cursor.setType(this.canBePlaced ? DragCursor.DRAG : DragCursor.NODRAG)
        this.lastPoint = { ...this.coord };
    }

    up({ button, curPoint, viewPortData, appActions, appData }) {
        super.click({ button, curPoint, viewPortData })
        if(button === 2) return appActions.cancel()
        if (button !== 0) return
        appData.curShape.state.selected = false;
        if (this.canBePlaced) {
            if (appData.curShape.jointToBack) appData.curShape.jointToBack.jointFromBackSide.add(appData.curShape)
            if (appData.curShape.jointToFront) appData.curShape.jointToFront.jointFromFrontSide.add(appData.curShape)
            appActions.addShape(appData.curShape)
            appActions.createPanel(appData.curShape)
        }
        //this.drag = false;
        //appActions.cancel();
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
    click({ button, appActions }) {
        

    }
}