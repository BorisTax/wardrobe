import Geometry, { Intersection } from "../../utils/geometry";
import Shape from "./Shape";
import ShapeStyle from "./ShapeStyle";
import { Color } from "../colors";
import { getJointData, isPointInPanelArea, SelectionSet } from "../../reducers/panels";
import { PropertyTypes } from "./PropertyData";
import { PlaceErrorMessages } from "./PlaceErrors";
import TextShape from "./TextShape";
export default class FasadeShape extends Shape {
  static DSP = "dsp"
  static GLASS = "glass"
  static VERT = "vert"
  static HOR = "hor"
  type = Shape.FASADE;
  constructor(data) {
    super();
    this.length = data.length;
    this.width = data.width;
    this.level = data.level === undefined ? 0 : data.level;
    if (this.level === 0) this.caption = new TextShape('ФАСАД', {x: data.position.x + data.width / 2, y: data.position.y - 50})
    this.parent = data.parent;
    this.base = data.base === undefined ? FasadeShape.GLASS : data.base;
    this.children = []
    this.division = data.division
    this.name = data.name || "ФАСАД"
    this.state.selectable = data.selectable === undefined ? true : data.selectable;
    this.state.deletable = data.deletable === undefined ? true : data.deletable;
    this.state.fixable = data.fixable === undefined ? true : data.fixable;
    this.state.fixed_move = data.fixed_move === undefined ? false : data.fixed_move;
    this.state.fixedLength = data.fixedLength === undefined ? { min: false, max: false } : data.fixedLength;
    const position = data.position || { x: 0, y: 0 };
    const last = { x: position.x + this.width, y: position.y + this.length };
    this.rect = { ...position, last, width: this.width, height: this.length };
    this.setStyle(new ShapeStyle(Color.BLACK, ShapeStyle.SOLID));
    this.dimensions = new Set();
    this.properties = [
      { key: "name", type: PropertyTypes.STRING, editable: false },
      { key: "length", type: PropertyTypes.INTEGER_POSITIVE_NUMBER, editable: this.state.resizable, setValue: (value) => {  } },
      { key: "width", type: PropertyTypes.INTEGER_POSITIVE_NUMBER },
    ]
  }

  drawSelf(ctx, realRect, screenRect, print = false) {
    
    let saveState = {...this.state}
    if(print) this.state = {...this.state, selected: false, highlighted: false}  
    super.drawSelf(ctx, realRect, screenRect);
    if (this.state.selected || this.state.highlighted) {
      this.getStyle().setWidth(2);
    } else {
      this.getStyle().setWidth(1);
    }
    const topLeft = Geometry.realToScreen(this.rect, realRect, screenRect);
    const bottomRight = Geometry.realToScreen(this.rect.last, realRect, screenRect);
    const width = bottomRight.x - topLeft.x;
    const height = bottomRight.y - topLeft.y;
    let x = topLeft.x
    let y = topLeft.y
    ctx.strokeRect(x, y, width, height);
    if(this.caption) this.caption.drawSelf(ctx, realRect, screenRect, 14)
    if(print) this.state = {...saveState}
  }
  refresh(realRect, screenRect) {
    this.rect.height = this.length;
    this.rect.width = this.width;
    this.rect.last = {
      x: this.rect.x + this.rect.width,
      y: this.rect.y + this.rect.height,
    };
  }

  hasChildren(){
    return this.children.length > 0
  }

  getProperties() {
    return super.getProperties()

  }

  setPosition(x, y) {
    this.rect.x = x;
    this.rect.y = y;
    this.rect.last = { x: x + this.rect.width, y: y + this.rect.height };
  }
  getPosition() {
    return this.rect;
  }
  setHidden(hidden) {
    this.state.hidden = hidden;
  }
  resize(length) {
    //if (length < this.minLength) return false
    const dl = length - this.length
    let dx, dy
    let joint = this.jointToBack
    if (joint) {
      if (this.vertical) {
        dx = 0;
        dy = dl
      } else {
        dx = dl;
        dy = 0
      }
      joint.moveTo(dx, dy)
    }
    joint = this.jointToFront
    if (joint) {
      if (this.vertical) {
        dx = 0;
        dy = -dl
      } else {
        dx = -dl;
        dy = 0
      }
      joint.moveTo(dx, dy)
    }
  }

  setLength(length) {
    this.length = length;
    this.refresh();
  }

  getLength() {
    return this.length;
  }

  fixLength({ min, max }) {
    this.minLength = min ? this.length : this.defaultMinLength;
    this.maxLength = max ? this.length : this.defaultMaxLength
    this.state.fixedLength = { min, max }
  }

  isUnderCursor(p, pixelRatio) {
    const mult = 2;
    return (
      p.x >= this.rect.x - pixelRatio * mult &&
      p.x <= this.rect.x + this.rect.width + pixelRatio * mult &&
      p.y >= this.rect.y - pixelRatio * mult &&
      p.y <= this.rect.y + this.rect.height + pixelRatio * mult
    );
  }

  moveTo(dx, dy, onGabaritChange = () => { }, doNotMove = false, prevPanel) {
    const { x, y } = this.getPosition();
    if (this.vertical) dy = 0;
    else dx = 0;
    const oldDX = dx;
    const oldDY = dy;
    let newX = x + dx;
    let newY = y + dy;
    let result;

    ; ({ result, newX, newY, dx, dy } = this.isMoveAvailable({ newX, newY, dx, dy, prevPanel }));
    if (doNotMove) return { result, newX, newY, newDX: dx, newDY: dy }
    if (result) {
      this.setPosition(newX, newY);
      for (let joint of this.jointFromBackSide) {
        joint.setLength(joint.getLength() + (dx + dy));
      }
      for (let joint of this.jointFromFrontSide) {
        joint.setLength(joint.getLength() - (dx + dy));
        const jpos = joint.getPosition();
        joint.setPosition(jpos.x + dx, jpos.y + dy);
      }
      if (this.gabarit) onGabaritChange(); //to recalculate wardrobe size
      return { result: true, newDX: oldDX - dx, newDY: oldDY - dy };
    } else return { result: false };
  }

  isMoveAvailable({ newX: x, newY: y, dx, dy, prevPanel }) {
    if (this.state.fixed_move) return { result: false };
    const resultNear = this.snapToNearest({ newX: x, newY: y, dx, dy, prevPanel });
    const resultJoint = this.snapToMinJointLength({ newX: x, newY: y, dx, dy });
    if (resultNear.result === true) {
      if (resultJoint.result === false) return { ...resultNear };
      if (this.vertical) {
        if (dx < 0)
          return resultNear.newX > resultJoint.newX
            ? { ...resultNear }
            : { ...resultJoint };
        return resultNear.newX < resultJoint.newX
          ? { ...resultNear }
          : { ...resultJoint };
      } else {
        if (dy < 0)
          return resultNear.newY > resultJoint.newY
            ? { ...resultNear }
            : { ...resultJoint };
        return resultNear.newY < resultJoint.newY
          ? { ...resultNear }
          : { ...resultJoint };
      }
    }
    if (resultJoint.result === true) return { ...resultJoint };
    return { result: true, newX: x, newY: y, dx, dy };
  }

  snapToMinJointLength({ newX: x, newY: y, dx, dy }) {
    const { jointsFromBackMinToMax, jointsFromFrontMinToMax } = getJointData(this)
    let minLengthDelta = 0
    let maxLengthDelta = 0
    for (let joint of jointsFromBackMinToMax) {
      let delta = joint.getLength() + dx + dy - joint.minLength;
      if (delta < minLengthDelta) minLengthDelta = delta
      delta = joint.maxLength - (joint.getLength() + dx + dy);
      if (delta < maxLengthDelta) maxLengthDelta = delta
    }
    let result = []
    result.push({
      delta: minLengthDelta,
      result: this.vertical ?
        { result: true, newX: x - minLengthDelta, newY: y, dx: dx - minLengthDelta, dy }
        :
        { result: true, newX: x, newY: y - minLengthDelta, dx, dy: dy - minLengthDelta }
    })
    result.push({
      delta: maxLengthDelta,
      result: this.vertical ?
        { result: true, newX: x + maxLengthDelta, newY: y, dx: dx + maxLengthDelta, dy }
        :
        { result: true, newX: x, newY: y + maxLengthDelta, dx, dy: dy + maxLengthDelta }
    })
    minLengthDelta = 0
    maxLengthDelta = 0
    jointsFromFrontMinToMax.forEach(joint => {
      let delta = joint.getLength() - dx - dy - joint.minLength;
      if (delta < minLengthDelta) minLengthDelta = delta
      delta = joint.maxLength - joint.getLength() + dx + dy;
      if (delta < maxLengthDelta) maxLengthDelta = delta
    })
    result.push({
      delta: minLengthDelta,
      result: this.vertical ?
        { result: true, newX: x + minLengthDelta, newY: y, dx: dx + minLengthDelta, dy }
        :
        { result: true, newX: x, newY: y + minLengthDelta, dx, dy: dy + minLengthDelta }
    })
    result.push({
      delta: maxLengthDelta,
      result: this.vertical ?
        { result: true, newX: x - maxLengthDelta, newY: y, dx: dx - maxLengthDelta, dy }
        :
        { result: true, newX: x, newY: y - maxLengthDelta, dx, dy: dy - maxLengthDelta }
    })
    result.sort((r1, r2) => r1.delta - r2.delta)
    if (result[0].delta < 0) return result[0].result
    return { result: false, newX: x, newY: y, dx, dy };
  }

  snapToNearest({ newX: x, newY: y, dx, dy, prevPanel }) {
    const { nearestFromBack, nearestFromFront } = this.getNearest(prevPanel);
    let near = nearestFromBack;
    if (near) {
      const margin = Math.max(this.panelMargin, near.panelMargin);
      if (this.vertical) {
        const minX = near.rect.x + near.thickness + margin;
        const minDX = minX - x;
        if (x < minX)
          return { result: true, newX: minX, newY: y, dx: dx + minDX, dy };
      } else {
        const minY = near.rect.y + near.thickness + margin;
        const minDY = minY - y;
        if (y < minY)
          return { result: true, newX: x, newY: minY, dx, dy: dy + minDY };
      }
    }
    near = nearestFromFront;
    if (near) {
      const margin = Math.max(this.panelMargin, near.panelMargin);
      if (this.vertical) {
        const minX = near.rect.x - this.thickness - margin;
        const minDX = x - minX;
        if (minX < x)
          return { result: true, newX: minX, newY: y, dx: dx - minDX, dy };
      } else {
        const minY = near.rect.y - this.thickness - margin;
        const minDY = y - minY;
        if (minY < y)
          return { result: true, newX: x, newY: minY, dx, dy: dy - minDY };
      }
    }
    return { result: false, newX: x, newY: y, dx, dy };
  }

  getNearest(prevPanel) {
    let nearestFromBack = Array.from(this.parallelFromBack)[0];
    let nearestFromFront = Array.from(this.parallelFromFront)[0];
    let maxX = 0
    let maxY = 0;
    for (let par of this.parallelFromBack) {
      if(prevPanel === par) continue
      if (par.rect.x + par.thickness > maxX && this.vertical) {
        nearestFromBack = par;
        maxX = par.rect.x;
      }
      if (par.rect.y + par.thickness > maxY && !this.vertical) {
        nearestFromBack = par;
        maxY = par.rect.y;
      }
    }
    maxX = 1000000;
    maxY = 1000000;
    for (let par of this.parallelFromFront) {
      if(prevPanel === par) continue
      if (par.rect.x < maxX && this.vertical) {
        nearestFromFront = par;
        maxX = par.rect.x;
      }
      if (par.rect.y < maxY && !this.vertical) {
        nearestFromFront = par;
        maxY = par.rect.y;
      }
    }
    return { nearestFromBack, nearestFromFront };
  }

  canBePlaced(x, y, panels, wardrobe) {
    if (
      x < 16 ||
      x > wardrobe.width - 16 ||
      y < 46 ||
      y > wardrobe.height - 16
    )
      return {result: false, reason: PlaceErrorMessages.OUTSIDE_AREA};
    this.parallelFromBack = new Set();
    this.parallelFromFront = new Set();
    for (let panel of panels) {
      if (!(panel.vertical === this.vertical)) continue;
      if (!isPointInPanelArea({x, y}, panel)) continue;
      const margin = Math.max(this.panelMargin, panel.panelMargin);
      if (this.vertical) {
        if (x >= panel.rect.x) {
          if (x - (panel.rect.x + panel.thickness) < margin) return {result: false, reason: PlaceErrorMessages.ON_PANEL}
          if (panel.rect.x + this.thickness <= x)
            this.parallelFromBack.add(panel);
        }
        if (x < panel.rect.x) {
          if (panel.rect.x - (x + this.thickness) < margin) return {result: false, reason: PlaceErrorMessages.ON_PANEL}
          if (panel.rect.x >= x) this.parallelFromFront.add(panel);
        }
      } else {
        if (y >= panel.rect.y) {
          if (y - (panel.rect.y + panel.thickness) < margin) return {result: false, reason: PlaceErrorMessages.ON_PANEL}
          if (panel.rect.y + this.thickness <= y)
            this.parallelFromBack.add(panel);
        }
        if (y < panel.rect.y) {
          if (panel.rect.y - (y + this.thickness) < margin) return {result: false, reason: PlaceErrorMessages.ON_PANEL}
          if (panel.rect.y >= y) this.parallelFromFront.add(panel);
        }
      }
    }
    return {result: true};
  }
  findConstraints(x, y, panels, wardrobe) {
    let minX = 0;
    let maxX = wardrobe.width;
    let minY = 46;
    let maxY = wardrobe.height;
    for (let panel of panels) {
      if (panel === this) continue;
      if (this.vertical === panel.vertical) continue;
      if (this.vertical) {
        if ((x - panel.rect.x) * (x - panel.rect.last.x) > 0) continue; //if panels not intersect
        if (panel.rect.y <= y) {
          if (panel.rect.y + panel.thickness >= minY) {
            minY = panel.rect.y + panel.thickness;
            this.jointToFront = panel;
          }
        }
        if (panel.rect.y > y) {
          if (panel.rect.y <= maxY) {
            maxY = panel.rect.y;
            this.jointToBack = panel;
          }
        }
      } else {
        if ((y - panel.rect.y) * (y - panel.rect.last.y) > 0) continue; //if panels not intersect
        if (panel.rect.x <= x) {
          if (panel.rect.x + panel.thickness >= minX) {
            minX = panel.rect.x + panel.thickness;
            this.jointToFront = panel;
          }
        }
        if (panel.rect.x > x) {
          if (panel.rect.x <= maxX) {
            maxX = panel.rect.x;
            this.jointToBack = panel;
          }
        }
      }
    }
    this.length = this.vertical ? maxY - minY : maxX - minX;
    this.rect = this.vertical ? { x, y: minY } : { x: minX, y };
    this.refresh();
    const result = (
      this.jointToBack.type === Shape.PANEL &&
      this.jointToFront.type === Shape.PANEL// && this.length >= this.minLength
    );
    return result? {result} : {result, reason: PlaceErrorMessages.NO_JOINTS}
  }

  getSingleDimensionData(vertical){
    const firstPoint = vertical ? {x: this.rect.x + this.width / 2, y: this.rect.y} : {x: this.rect.x, y: this.rect.y + this.length / 2}
    const secondPoint = vertical ? {x: this.rect.x + this.width / 2, y: this.rect.last.y} : {x: this.rect.last.x, y: this.rect.last.y - this.length / 2}
    const midPoint = { x: (firstPoint.x + secondPoint.x) / 2, y: (firstPoint.y + secondPoint.y) / 2 }
    return {firstPoint, secondPoint, midPoint}
  }

  isInSelectionRect({ topLeft, bottomRight }) {
    const inRect = [
      Geometry.pointInRect(this.rect, topLeft, bottomRight),
      Geometry.pointInRect(this.rect.last, topLeft, bottomRight),
    ];
    const full = inRect.every((i) => i === true);
    const cross = Intersection.RectangleRectangle(topLeft, bottomRight, this.rect, this.rect.last).length > 0;
    return { cross, full };
  }
}
