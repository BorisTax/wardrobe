import Geometry from "../../utils/geometry";
import Shape from "./Shape";
import { PropertyTypes } from "./PropertyData";
import PanelShape from "./PanelShape";
export default class DoublePanelShape extends PanelShape {
  type = Shape.PANEL;
  constructor(data) {
    super({...data, vertical: true, thickness: 32});
    this.name = "Стойка внутр";
    this.double = true
    this.dimensions = new Set();
    this.properties = [
        {key: "name", type: PropertyTypes.STRING, editable: true},
        {key: "length", type: PropertyTypes.INTEGER_POSITIVE_NUMBER},
        {key: "width", type: PropertyTypes.INTEGER_POSITIVE_NUMBER},
    ]
  }

  drawSelf(ctx, realRect, screenRect, print = false) {
    if (this.state.hidden) return;
    this.refresh(realRect, screenRect);
    this.refreshStyle(ctx)
    if (this.state.selected || this.state.highlighted) {
      this.getStyle().setWidth(2);
    } else {
      this.getStyle().setWidth(1);
    }
    const topLeft = Geometry.realToScreen(this.rect, realRect, screenRect);
    const bottomRight = Geometry.realToScreen(this.rect.last, realRect, screenRect);
    const width = bottomRight.x - topLeft.x;
    const height = bottomRight.y - topLeft.y;
    let x = Math.trunc(topLeft.x) + 0.5;
    let y = Math.trunc(topLeft.y) + 0.5;
    ctx.strokeRect(x, y, width / 2, height);
    ctx.strokeRect(x, y, width, height);
  }

}
