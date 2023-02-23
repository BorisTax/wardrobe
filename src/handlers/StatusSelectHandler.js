import { MouseHandler } from "./MouseHandler";
import RectangleShape from  "../components/shapes/RectangleShape"
import ShapeStyle from "../components/shapes/ShapeStyle";
import { Rectangle } from "../utils/geometry";
import { Color } from "../components/colors";
import { setCurCoord } from "../functions/viewPortFunctions";
export class StatusSelectHandler extends MouseHandler {
    constructor(point, state){
        super(state)
        this.x0=point.x
        this.y0=point.y
        this.curShape = new RectangleShape(new Rectangle())
        this.curShape.setStyle(new ShapeStyle(Color.BLACK,ShapeStyle.DASH))
        this.setStatusBar()
    }
    setStatusBar(){
        this.statusBar = []
    }
    move({curPoint, viewPortData, setViewPortData, appData, keys}){
        super.move({curPoint, viewPortData});
        setViewPortData(prevData => setCurCoord(this.coord, this.curPoint, prevData))
        let crossSelect
        if(this.coord.x > this.x0) {
            this.curShape.style.setStroke(ShapeStyle.SOLID)
            crossSelect = false
            }
            else{
            this.curShape.style.setStroke(ShapeStyle.DASH)
            crossSelect = true
            }
        
        this.curShape.setCorners({x: this.x0, y: this.y0}, this.coord)
        this.selectPanels({topLeft: this.curShape.model.topLeft, bottomRight: this.curShape.model.bottomRight},
            appData.panels,
            crossSelect
            );
    }
    up({button, appActions}){
        if(button===0) appActions.stopSelection(this.isSelectedPanels);
        appActions.updateState()
    }
    keypress(code){
        return super.keypress(code)
    }
    click({screenProps,shiftKey,altKey}){
        
    }
    selectPanels(rect, panels, crossSelect){
        this.isSelectedPanels = false
        for(let p of panels){
            p.setState({selected: false});
            const {full, cross} = p.isInRect(rect)
            if(full) {p.setState({selected: true}); this.isSelectedPanels = true}
            if(cross && crossSelect) {p.setState({selected: true}); this.isSelectedPanels = true}
        }
    }

}