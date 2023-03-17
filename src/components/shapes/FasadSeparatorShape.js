import Shape from "./Shape";
import ShapeStyle from "./ShapeStyle";
import { Color } from "../colors";
export default class FasadSeparatorShape extends PanelShape {
  type = Shape.PANEL;
  constructor(data) {
    super(data);
    this.gabarit = data.gabarit; //габаритная деталь
    this.length = data.length;
    //this.width = data.gabarit ? data.wardrobe.depth : data.wardrobe.depth - 100;
    this.panelMargin = data.panelMargin || 100;
    if (!data.active) this.active = false;
    this.vertical = data.vertical;
    //this.name = data.name || (this.vertical ? "Стойка внутр" : "Полка");
    this.defaultMinLength = data.minLength || 282;;
    this.defaultMaxLength = data.maxLength || 10000000;
    this.minLength = this.defaultMinLength
    this.maxLength = this.defaultMaxLength;
    this.state.selectable = data.selectable === undefined ? true : data.selectable;
    this.state.deletable = data.deletable === undefined ? true : data.deletable;
    this.state.fixable = data.fixable === undefined ? true : data.fixable;
    this.state.fixed_move = data.fixed_move === undefined ? false : data.fixed_move;
    this.state.fixedLength = data.fixedLength === undefined ? { min: false, max: false } : data.fixedLength;
    this.state.resizable = data.resizable === undefined ? true : data.resizable;
    this.state.measurable = data.measurable === undefined ? true : data.measurable;
    this.state.drillable = false
    this.state.blocked = data.blocked === undefined ? false : data.fixed;
    this.state.hidden = data.hidden;
    this.thickness = data.thickness || 0;
    const position = data.position || { x: 0, y: 0 };
    const w = data.vertical ? this.thickness : data.length;
    const h = data.vertical ? data.length : this.thickness;
    const last = { x: position.x + w, y: position.y + h };
    this.rect = { ...position, last, w, h };
    this.setStyle(new ShapeStyle(Color.BLACK, ShapeStyle.SOLID));
    this.jointFromBackSide = data.jointFromBackSide || new Set();
    this.jointFromFrontSide = data.jointFromFrontSide || new Set();
    this.parallelFromBack = data.parallelFromBack || new Set();
    this.parallelFromFront = data.parallelFromFront || new Set();
    this.dimensions = new Set();
    this.properties = []
  }

}
