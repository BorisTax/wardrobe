import Geometry, { Rectangle } from '../../utils/geometry';
import Shape from "./Shape";
import ShapeStyle from './ShapeStyle';
import { Color } from '../colors';
import { PropertyTypes } from "./PropertyData";
import RectangleShape from './RectangleShape';
import TableShape from './TableShape';
import TextShape from './TextShape';
export default class TableLayoutShape extends Shape {
    constructor(model) {
        super();
        this.model = { ...model, bottomRight: { x: model.length, y: model.topLeft.y - model.width } };
        this.innerRect = new RectangleShape(new Rectangle())
        this.outerRect = new RectangleShape(new Rectangle())
        this.refreshModel()
        this.outerRect.setStyle(new ShapeStyle(Color.BLACK, ShapeStyle.SOLID));
        this.innerRect.setStyle(new ShapeStyle(Color.BLACK, ShapeStyle.DASH));
        this.shapeIndex = new TextShape();
        this.shapeIndex.setAnchor({ vertical: TextShape.TOP, horizontal: TextShape.LEFT });
        this.table = new TableShape({
            topLeft: { x: this.outerRect.model.bottomRight.x + 50, y: this.outerRect.model.topLeft.y },
            list: { primary: [], secondary: [] },
            captions: this.model.captions
        })
        this.properties = [
            { type: PropertyTypes.STRING, labelKey: "name", public: true },
            { type: PropertyTypes.STRING, labelKey: "dimensions", public: true },
            { type: PropertyTypes.VERTEX, labelKey: "position" },
            { type: PropertyTypes.BOOL, labelKey: "orientation" },
        ]
        this.defineProperties();
    }

    drawSelf(ctx, realRect, screenRect, print = false, index) {
        super.drawSelf(ctx, realRect, screenRect)
        this.outerRect.setFillStyle(Color.WHITE)
        if (!print) this.outerRect.setFillStyle(Color.LIGHT_GRAY)
        if (this.model.active) this.outerRect.setStyle(ShapeStyle.ACTIVE_SHAPE); else this.outerRect.setStyle(ShapeStyle.INACTIVE_SHAPE)
        if (print) this.outerRect.setStyle(ShapeStyle.INACTIVE_SHAPE)
        this.outerRect.drawSelf(ctx, realRect, screenRect, true)
        if (!print) this.innerRect.drawSelf(ctx, realRect, screenRect)
        const tableFitRect = {
            width: Geometry.realToScreenLength(this.outerRect.model.width, realRect.width, screenRect.width),
            height: Geometry.realToScreenLength(this.outerRect.model.height, realRect.width, screenRect.width),
        }
        //if(print) 
        tableFitRect.width = tableFitRect.width * 0.5
        this.table.drawSelf(ctx, realRect, screenRect, tableFitRect);
        if (!print) {
            let text = `${this.model.captions.tableTitle} ${index}`
            if (this.model.multiply > 1) text = text + ` x${this.model.multiply}`
            this.shapeIndex.setText(text)
            this.shapeIndex.setPoint({ x: this.outerRect.model.topLeft.x, y: this.outerRect.model.bottomRight.y });
            this.shapeIndex.drawSelf(ctx, realRect, screenRect)
        }
    }
    refresh(realRect, screenRect) {
        let color = Color.BLACK;
        this.innerRect.setColor(color);
        this.outerRect.setColor(color);
        this.table.model.topLeft = { x: this.outerRect.model.bottomRight.x + 50, y: this.outerRect.model.topLeft.y }
    }
    setCaptions(captions){
        this.model.captions = captions
        this.table.setCaptions(captions)
    }
    setPanelList(panelList) {
        const pList = { primary: {}, secondary: {} }
        for (const l of panelList) {
            if (l.state.canBePlaced || l.model.placedForce)
                if (l.getTableId() === this.model.id) {
                    const id = l.getId()
                    const listKey = l.model.listKey
                    if (pList[listKey][id]) {
                        pList[listKey][id].count += l.model.multiply;
                    } else {
                        pList[listKey][id] = {
                            id,
                            length: l.model.origLength,
                            width: l.model.origWidth,
                            count: l.model.multiply,
                            module: l.model.module ? l.model.module : ""
                        }
                    }
                }
        }

        const list = { primary: [], secondary: [] }
        for (const listKey of ["primary", "secondary"]) {
            let totalCount = 0;
            for (const key in pList[listKey]) {
                list[listKey].push([
                    pList[listKey][key].id,
                    pList[listKey][key].length,
                    pList[listKey][key].width,
                    pList[listKey][key].count,
                    pList[listKey][key].module,

                ])
                totalCount += pList[listKey][key].count
            }
            if (totalCount > 0) list[listKey].push(["", this.model.captions.total, "", totalCount, ""])
        }
        this.table = new TableShape({
            topLeft: { x: this.outerRect.model.bottomRight.x + 50, y: this.outerRect.model.topLeft.y },
            list, captions: this.model.captions
        })
    }
    getId() {
        return this.model.id;
    }
    getMarkers() {
        let list = [];
        return list;
    }
    isPointInside(p, inner = false) {
        if (!inner)
            return (p.x >= this.outerRect.model.topLeft.x) && (p.x <= this.outerRect.model.topLeft.x + this.outerRect.model.width) && (p.y <= this.outerRect.model.topLeft.y) && (p.y >= this.outerRect.model.topLeft.y - this.outerRect.model.height);
        else
            return (p.x >= this.innerRect.model.topLeft.x) && (p.x <= this.innerRect.model.bottomRight.x) && (p.y <= this.innerRect.model.topLeft.y) && (p.y >= this.innerRect.model.bottomRight.y);
    }
    setTopLeft(topLeft) {
        this.model.topLeft = { ...topLeft }
        this.model.bottomRight = { x: topLeft.x + this.model.length, y: topLeft.y - this.model.width };
        this.refreshModel()
    }
    refreshModel() {
        //this.model.topLeft={x:this.properties[2].value.x+this.model.margin,y:this.properties[2].value.y-this.model.margin}
        //this.model.bottomRight={x:this.properties[2].value.x+this.model.margin+this.model.length,y:this.properties[2].value.y-this.model.margin-this.model.width}
        this.outerRect.setCorners(this.model.topLeft, this.model.bottomRight);
        const tl = { x: this.model.topLeft.x + this.model.marginLength, y: this.model.topLeft.y - this.model.marginWidth };
        const br = { x: this.model.bottomRight.x - this.model.marginLength, y: this.model.bottomRight.y + this.model.marginWidth };
        this.innerRect.setCorners(tl, br);
    }
    getDistance(point) {

    }
    isInRect(topLeft, bottomRight) {
        return { cross: false, full: false };
    }
    toString() {
        return "Rectangle";
    }
    getDescription() {
        return 'Rectangle';
    }
}