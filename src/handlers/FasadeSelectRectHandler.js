import { MouseHandler } from "./MouseHandler";
import RectangleShape from "../components/shapes/RectangleShape"
import ShapeStyle from "../components/shapes/ShapeStyle";
import { Rectangle } from "../utils/geometry";
import { Color } from "../components/colors";
import { setCurCoord } from "../functions/viewPortFunctions";
import { FasadeFreeHandler } from "./FasadeFreeHandler";
import { bringSelectedToFront } from "../reducers/panels";
export class FasadeSelectRectHandler extends MouseHandler {
    constructor(point, state) {
        super(state)
        this.x0 = point.x
        this.y0 = point.y
        this.curShape = new RectangleShape(new Rectangle())
        this.curShape.setStyle(new ShapeStyle(Color.BLACK, ShapeStyle.DASH))
        this.setStatusBar()
    }
    setStatusBar() {
        this.statusBar = []
    }
    move({ curPoint, viewPortData, setViewPortData, appData, keys }) {
        super.move({ curPoint, viewPortData });
        setViewPortData(prevData => setCurCoord(this.coord, this.curPoint, prevData))
        let crossSelect
        if (this.coord.x > this.x0) {
            this.curShape.style.setStroke(ShapeStyle.SOLID)
            crossSelect = false
        }
        else {
            this.curShape.style.setStroke(ShapeStyle.DASH)
            crossSelect = true
        }

        this.curShape.setCorners({ x: this.x0, y: this.y0 }, this.coord)
        this.selectPanels({ topLeft: this.curShape.model.topLeft, bottomRight: this.curShape.model.bottomRight },
            appData.fasades,
            appData.fasadeDimensions,
            appData.selectedPanels,
            crossSelect
        );
        appData.fasades = bringSelectedToFront(appData.fasades, appData.selectedPanels)
    }
    up({ button, appActions }) {

    }
    keypress(code) {
        return super.keypress(code)
    }
    click({ button, curPoint, viewPortData, setViewPortData, appActions, appData, keys }) {
        super.click({ curPoint, viewPortData });
        if (button !== 0) return
        for (let p of [...appData.fasades, ...appData.fasadeDimensions]) {
            if(p.children && p.children.length > 0 ) continue
            if (p.isUnderCursor(this.coord, viewPortData.pixelRatio)) {
                if (keys.shiftKey) {
                    if(appData.selectedPanels.has(p)) appData.selectedPanels.delete(p);
                            else appData.selectedPanels.add(p)
                } else {
                    appData.selectedPanels.add(p)
                }
            } else {
                if (!keys.shiftKey && !this.isSelectedPanels) {
                    appData.selectedPanels.delete(p)
                }
            }
        }
        appData.fasades = bringSelectedToFront(appData.fasades, appData.selectedPanels)
        this.isSelectedPanels = appData.selectedPanels.size > 0
        if (button === 0) appActions.stopSelection(this.isSelectedPanels, FasadeFreeHandler);
        appActions.updateState()
    }
    leave({appActions}){
        super.leave()
        appActions.cancel()
    }

    selectPanels(rect, fasades, fasadeDimensions, selectedPanels, crossSelect) {
        this.isSelectedPanels = false
        for (let p of [...fasades, ...fasadeDimensions]) {
            //selectedPanels.delete(p)
            if(p.children && p.children.length > 0 ) continue
            const { full, cross } = p.isInSelectionRect(rect)
            if (full) { selectedPanels.add(p); this.isSelectedPanels = true }
            if (cross && crossSelect) { selectedPanels.add(p); this.isSelectedPanels = true }
        }
        
    }

}