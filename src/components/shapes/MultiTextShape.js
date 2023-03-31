import Geometry from "../../utils/geometry";
import Shape from "./Shape";
import TextShape from "./TextShape";

export default class MultiTextShape extends Shape {
  static CENTER = 0;
  static LEFT = 1;
  static RIGHT = 2;
  static TOP = 3;
  static BOTTOM = 4;
  constructor(
    text = [""],
    point = { x: -3000, y: 0 },
    angle = 0,
    anchor = { vertical: TextShape.CENTER, horizontal: TextShape.CENTER }
  ) {
    super();
    this.textShapes = []
    for(let t of text){
      this.textShapes.push(new TextShape(t, point, angle, anchor))
    }
    this.p = point;
    this.controlPoints = [this.p];
    this.text = text;
    this.anchor = anchor;
    this.angle = angle;
    this.fitRect = { width: 1000, height: 1000 };
  }


  draw(ctx, realRect, screenRect, fontSize, vertical) {
    super.draw(ctx, realRect, screenRect);
    let basePoint = { ...this.p0 };
    var { width: totalWidth, height: totalHeight, offsets, angle } = this.getTextOffsets(ctx, fontSize)
    const middleX = angle === 0 ? totalWidth / 2 : -totalHeight / 2
    const middleY = angle === 0 ? totalHeight / 2 : totalWidth / 2 
    const newPoint = Geometry.rotatePoint(basePoint, angle, {x: 0, y: 0});
    let i = 0 
    let offsetX = 0
    let offsetY = 0
    for(let t of this.textShapes){
        ctx.save();
        ctx.translate(basePoint.x - newPoint.x - middleX, basePoint.y - newPoint.y + middleY);
        ctx.rotate(angle);
        ctx.fillText(t.text, basePoint.x + offsetX, basePoint.y + offsetY);
        ctx.restore();
        offsetX += offsets.width[i]
        offsetY += offsets.height[i]
        i++
    }
  }

  getTextOffsets(ctx, fontSize) {
    var { width, height } = this.fitRect;
    let fitWidth = width
    let fitHeight = height
    let oneWidthOffsets = []
    let oneHeightOffsets = []
    let multiWidthOffsets = []
    let multiHeightOffsets = []
    for (fontSize = 14; fontSize > 5; fontSize -= 1) {
      ;({ width, height } = this.fitRect)
      oneWidthOffsets = []
      oneHeightOffsets = []
      multiWidthOffsets = []
      multiHeightOffsets = []
      ctx.font = `${fontSize}px serif`;
      let oneLineWidth = 0
      let oneLineHeight = 0
      let multiLineWidth = 0
      let multiLineHeight = 0
      for(let t of this.textShapes){
        ({ width, height } = t.getTextRect(ctx, ctx.font));
        oneLineWidth += width
        oneWidthOffsets.push(width)
        oneLineHeight = Math.max(oneLineHeight, height)
        oneHeightOffsets.push(0)
        multiLineWidth = Math.max(multiLineWidth, width)
        multiWidthOffsets.push(0)
        multiLineHeight += height
        multiHeightOffsets.push(height)
      }
      
      if (fitWidth >= oneLineWidth && fitHeight >= oneLineHeight) return {width: oneLineWidth, height: oneLineHeight, offsets: {width: oneWidthOffsets, height: oneHeightOffsets}, angle: 0};
      if (fitHeight >= oneLineWidth && fitWidth >= oneLineHeight) return {width: oneLineWidth, height: oneLineHeight, offsets: {width: oneWidthOffsets, height: oneHeightOffsets}, angle: - Math.PI / 2};
      if (fitWidth >= multiLineWidth && fitHeight >= multiLineHeight) return {width: multiLineWidth, height: multiLineHeight, offsets: {width: multiWidthOffsets, height: multiHeightOffsets}, angle: 0};
      if (fitHeight >= multiLineWidth && fitWidth >= multiLineHeight) return {width: multiLineWidth, height: multiLineHeight, offsets: {width: multiWidthOffsets, height: multiHeightOffsets}, angle: - Math.PI / 2};
    }
    return {width, height, offsets: {width: oneWidthOffsets, height: oneHeightOffsets}};
  }

  refresh(realRect, screenRect) {
    this.p0 = Geometry.realToScreen(this.p, realRect, screenRect);
  }
  setFitRect(fitRect, fit = true) {
    this.fitRect = { ...fitRect };
    this.fit = fit;
  }
  rotate(angle) {
    this.angle = angle;
  }

  setText(text) {
    let i = 0 
    this.textShapes.forEach(t => {t.setText(text[i]); i++})
  }
  setFont(font) {
    this.font = font
    this.textShapes.forEach(t => t.setFont(font))
  }
  setPoint(point) {
    this.p = point;
    this.textShapes.forEach(t => t.setPoint(point))
  }
  setAnchor(anchor) {
    this.anchor = { ...this.anchor, ...anchor };
    this.textShapes.forEach(t => t.setAnchor(anchor))
  }

}
