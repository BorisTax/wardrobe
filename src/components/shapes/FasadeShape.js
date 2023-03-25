import Geometry, { Intersection } from "../../utils/geometry";
import Shape from "./Shape";
import ShapeStyle from "./ShapeStyle";
import { Color } from "../colors";
import { getJointData, getProfile, isPointInPanelArea, SelectionSet } from "../../reducers/panels";
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
    this.divided = data.divided
    this.minLength = 100
    this.minWidth = 100
    this.name = data.name || "ФАСАД"
    this.state.selectable = data.selectable === undefined ? true : data.selectable;
    this.state.deletable = data.deletable === undefined ? true : data.deletable;
    this.state.fixable = data.fixable === undefined ? true : data.fixable;
    this.state.fixedWidth = data.fixedWidth === undefined ? false : data.fixedWidth;
    this.state.fixedLength = data.fixedLength === undefined ? false : data.fixedLength;
    const position = data.position || { x: 0, y: 0 };
    const last = { x: position.x + this.width, y: position.y + this.length };
    this.rect = { ...position, last, width: this.width, height: this.length };
    this.setStyle(new ShapeStyle(Color.BLACK, ShapeStyle.SOLID));
    this.dimensions = new Set();
    this.properties = [
      { key: "name", type: PropertyTypes.STRING, editable: () => false },
      { key: "length", type: PropertyTypes.INTEGER_POSITIVE_NUMBER, editable: () => this.isLengthEditable() , setValue: (value) => {this.setLength(value)} },
      { key: "width", type: PropertyTypes.INTEGER_POSITIVE_NUMBER, editable: () => this.isWidthEditable(), setValue: (value) => {this.setWidth(value)}},
    ]
  }

  drawSelf(ctx, realRect, screenRect, print = false) {
    
    let saveState = {...this.state}
    if(print) this.state = {...this.state, selected: false, highlighted: false}  
    super.drawSelf(ctx, realRect, screenRect);
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

  isLengthEditable(){
    if(this.level === 0) return false
    if(this.fixedLength) return false
    return this.parent.divided === FasadeShape.VERT ? this.level > 1: true 
  }

  isWidthEditable(){
    if(this.level === 0) return false
    if(this.fixedWidth) return false
    return this.parent.divided === FasadeShape.HOR ? this.level > 1: true 
  }

  hasChildren(){
    return this.children.length > 0
  }

  resizeChildrenByLength({initiator, newInitiatorLength, newInitiatorBase, newParentLength}){
    const profiles = this.getProfiles({initiator, newInitiatorBase})
    const totalProfileSize = profiles.reduce((a, p) => a + p, 0)
    const fixedChildren = this.children.filter(c => c === initiator || c.state.fixed)
    const freeChildren = this.children.filter(c => c !== initiator && !c.state.fixed)
    if(freeChildren.length === 0) return false
    const totalSize = newParentLength || this.length
    const totalFixedChildrenSize = fixedChildren.reduce((a, c) => {
                let childSize = (c === initiator) ? newInitiatorLength : c.length
                return a + childSize
                }, 0)
    const partFreeSize = Math.round((totalSize - totalFixedChildrenSize - totalProfileSize) / freeChildren.length)
    let x = this.rect.x
    let y = this.rect.y
    let dx = 0
    let dy = 0
    const ch = this.children
    let total = 0
    let partSize
    for(let i = 0; i < ch.length - 1; i++) {
      partSize = (ch[i] === initiator) ? newInitiatorLength : ch[i].length
      if(ch[i] !== initiator && !ch[i].state.fixed) partSize = partFreeSize
      if(!ch[i].checkLength(partSize)) return false
      dy += partSize + profiles[i]
      total += partSize + profiles[i]
      ch[i].savePosition(x, y)
      y += dy 
    }
    partSize = totalSize - total
    if(!ch.at(-1).checkLength(partSize)) return false
    ch.at(-1).savePosition(x, y)
    return true
  }

  resizeChildrenByWidth({initiator, newInitiatorWidth, newInitiatorBase, newParentWidth}){
    const profiles = this.getProfiles({initiator, newInitiatorBase})
    const totalProfileSize = profiles.reduce((a, p) => a + p, 0)
    const fixedChildren = this.children.filter(c => c === initiator || c.state.fixed)
    const freeChildren = this.children.filter(c => c !== initiator && !c.state.fixed)
    if(freeChildren.length === 0) return false
    const totalSize = newParentWidth || this.width
    const totalFixedChildrenSize = fixedChildren.reduce((a, c) => {
                let childSize = (c === initiator) ? newInitiatorWidth : c.width
                return a + childSize
                }, 0)
    const partFreeSize = Math.round((totalSize - totalFixedChildrenSize - totalProfileSize) / freeChildren.length)
    let x = this.rect.x
    let y = this.rect.y
    let dx = 0
    let dy = 0
    const ch = this.children
    let total = 0
    let partSize
    for(let i = 0; i < ch.length - 1; i++) {
      partSize = (ch[i] === initiator) ? newInitiatorWidth : ch[i].width
      if(ch[i] !== initiator && !ch[i].state.fixed) partSize = partFreeSize
      if(!ch[i].checkWidth(partSize)) return false
      dx += partSize + profiles[i]
      total += partSize + profiles[i]
      ch[i].savePosition(x, y)
      x += dx
    }
    partSize = totalSize - total
    if(!ch.at(-1).checkWidth(partSize)) return false
    ch.at(-1).savePosition(x, y)
    return true
  }

  setLength(length){
    if(this.parent.divided === FasadeShape.HOR) {
        const result = this.parent.resizeChildrenByLength({initiator: this, newInitiatorLength: length})
        if(result) this.parent.applyChanges()
      }else{
        const result = this.parent.parent.resizeChildrenByLength({initiator: this.parent, newInitiatorLength: length})
        if(result) this.parent.parent.applyChanges()
      }
  }
  setWidth(width){
    if(this.parent.divided === FasadeShape.VERT) {
        const result = this.parent.resizeChildrenByWidth({initiator: this, newInitiatorWidth: width})
        if(result) this.parent.applyChanges()
      }else{
        const result = this.parent.parent.resizeChildrenByWidth({initiator: this.parent, newInitiatorWidth: width})
        if(result) this.parent.parent.applyChanges()
      }
  }
  checkLength(length){
    if(length < this.minLength) return false
    if(this.state.fixedLength && length !== this.length) return false
    if(this.hasChildren()){
      if(this.divided === FasadeShape.HOR) {
          const result = this.resizeChildrenByLength({newParentLength: length})
          if(result) this.savedLength = length
          return result
        }
      if(this.children.some(c => !c.checkLength(length))) return false 
    }
    this.savedLength = length
    return true
  }

  checkWidth(width){
    if(width < this.minWidth) return false
    if(this.state.fixedWidth && width !== this.width) return false 
    if(this.hasChildren()){
      if(this.divided === FasadeShape.VERT) {
        const result = this.resizeChildrenByWidth({newParentWidth: width})
        if(result) this.savedWidth = width
        return result
      }
      if(this.children.some(c => !c.checkWidth(width))) return false 
    }
    this.savedWidth = width
    return true
  }

  applyChanges(){
    if(this.savedWidth) this.width = this.savedWidth
    if(this.savedLength) this.length = this.savedLength
    //if(this.savedPosition) this.setPosition(this.savedPosition.x, this.savedPosition.y)
    //this.savedPosition = null
    this.savedLength = null
    this.savedWidth = null
    let x = this.rect.x 
    let y = this.rect.y
    let dx = 0
    let dy = 0
    if(this.hasChildren()) {
        let width
        let length
        for(let i = 0; i < this.children.length - 1; i++){
                let c = this.children[i]
                let cNext = this.children[i + 1]
                let profile = getProfile(c.base, cNext.base)
                width = c.savedWidth || c.width
                length = c.savedLength || c.length
                c.setPosition(x, y, {width, height: length})
                if(this.divided === FasadeShape.VERT) {
                  x += width + profile
                }else{
                  y += length + profile
                }
                c.applyChanges()
              }
        width = this.children.at(-1).savedWidth || this.children.at(-1).width
        length = this.children.at(-1).savedLength || this.children.at(-1).length
        this.children.at(-1).setPosition(x, y, {width, height: length})
        this.children.at(-1).applyChanges()
      }
  }

  getProfiles({initiator, newBase = initiator && initiator.base}){
    let profiles = []
    for(let i=0; i < this.children.length - 1; i++) {
      const base1 = this.children[i] === initiator ? newBase : this.children[i].base
      const base2 = this.children[i + 1] === initiator ? newBase : this.children[i + 1].base
      profiles.push(getProfile(base1, base2))
    }
    return profiles
  }

  getProperties() {
    return super.getProperties()

  }
  savePosition(x, y) {
    this.savedPosition = {x, y}
  }

  setPosition(x, y, {width = 0, height = 0}) {
    this.rect.x = x;
    this.rect.y = y;
    this.rect.last = { x: x + width || this.width, y: y + height || this.length };
  }
  getPosition() {
    return this.rect;
  }
  setHidden(hidden) {
    this.state.hidden = hidden;
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

  isUnderCursor(p, pixelRatio) {
    const mult = 2;
    return (
      p.x >= this.rect.x - pixelRatio * mult &&
      p.x <= this.rect.x + this.rect.width + pixelRatio * mult &&
      p.y >= this.rect.y - pixelRatio * mult &&
      p.y <= this.rect.y + this.rect.height + pixelRatio * mult
    );
  }
}
