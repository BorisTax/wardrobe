import Geometry, { Intersection } from "../../utils/geometry";
import Shape from "./Shape";
import ShapeStyle from "./ShapeStyle";
import { Color } from "../colors";
import { getProfile} from "../../reducers/panels";
import { PropertyTypes } from "./PropertyData";
import TextShape from "./TextShape";
import { FasadBase, getFasadBases } from "../../reducers/materialReducer";
import { CustomPaths, getCustomPath } from "./shapes";
export default class FasadeShape extends Shape {
  static VERT = "vert"
  static HOR = "hor"
  type = Shape.FASADE;
  constructor(data) {
    super();
    this.height = data.height;
    this.width = data.width;
    this.level = data.level === undefined ? 0 : data.level;
    if (this.level === 0) this.caption = new TextShape('ФАСАД', {x: data.position.x + data.width / 2, y: data.position.y - 50})
    this.parent = data.parent;
    this.base = data.base === undefined ? FasadBase.MIRROR : data.base;
    this.children = []
    this.divided = data.divided
    this.minHeight = 100
    this.minWidth = 100
    this.name = data.name || "ФАСАД"
    this.state.selectable = data.selectable === undefined ? true : data.selectable;
    this.state.deletable = data.deletable === undefined ? true : data.deletable;
    this.state.fixable = this.level > 0
    this.state.fixedWidth = data.fixedWidth === undefined ? false : data.fixedWidth;
    this.state.fixedHeight = data.fixedHeight === undefined ? false : data.fixedHeight;
    const position = data.position || { x: 0, y: 0 };
    const last = { x: position.x + this.width, y: position.y + this.height };
    this.rect = { ...position, last, width: this.width, height: this.height };
    this.setStyle(new ShapeStyle(Color.BLACK, ShapeStyle.SOLID));
    this.dimensions = new Set();
    this.properties = [
      { key: "name", type: PropertyTypes.STRING, editable: () => false },
      { key: "height", type: PropertyTypes.INTEGER_POSITIVE_NUMBER, editable: () => this.isHeightEditable(), extra: () => this.getHeightParts(), setValue: (value) => {this.setHeight(value)} },
      { key: "width", type: PropertyTypes.INTEGER_POSITIVE_NUMBER, editable: () => this.isWidthEditable(), extra: () => this.getWidthParts(), setValue: (value) => {this.setWidth(value)}},
      { key: "base", type: PropertyTypes.LIST, items: (captions) => getFasadBases().map(b => captions.info.materials.fasadBases[b]), editable: () => true, getValue: (value, captions) => captions.info.materials.fasadBases[value], setValue: (value) => {}},
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
    if(!print && (this.state.fixedWidth || this.state.fixedHeight)) {
      ctx.lineWidth = 1
      let lock = (this.state.fixedWidth && !this.state.fixedHeight) ? CustomPaths.LOCK_WIDTH : 0
      lock = (!this.state.fixedWidth && this.state.fixedHeight) ? CustomPaths.LOCK_HEIGHT : lock
      lock = (this.state.fixedWidth && this.state.fixedHeight) ? CustomPaths.LOCK_BOTH : lock
      const path = new Path2D(getCustomPath({x: x + width / 2, y: y + height / 2}, lock))
      ctx.fill(path);
    }
    if(print) this.state = {...saveState}
  }
  refresh(realRect, screenRect) {
    this.rect.height = this.height;
    this.rect.width = this.width;
    this.rect.last = {
      x: this.rect.x + this.rect.width,
      y: this.rect.y + this.rect.height,
    };
  }

  fixWidth(fix){
    if(this.state.fixable) this.state.fixedWidth = fix
    if(this.hasChildren()){
      if(this.divided === FasadeShape.HOR) {
        this.children.forEach(c => c.fixWidth(fix))
      }
    }
  }
  fixHeight(fix){
    if(this.state.fixable) this.state.fixedHeight = fix
    if(this.hasChildren()){
      if(this.divided === FasadeShape.VERT) {
        this.children.forEach(c => c.fixHeight(fix))
      }
    }
  }
  getHeightParts(){
    var s = ""
    if(this.hasChildren() && this.divided === FasadeShape.HOR){
      const profiles = this.getProfiles()
      s = this.children.reduce((a, i) => {
        const profile = profiles.shift()
        return a + i.height +( profile ? `+${profile}+` : "")
      }, "")
      s = ` (${s})`
    }
    return s
  }

  getWidthParts(){
    var s = ""
    if(this.hasChildren() && this.divided === FasadeShape.VERT){
      const profiles = this.getProfiles()
      s = this.children.reduce((a, i) => {
        const profile = profiles.shift()
        return a + i.width + (profile ? `+${profile}+` : "")
      }, "")
      s = ` (${s})`
    }
    return s
  }

  isHeightEditable(){
    if(this.level === 0) return false
    if(this.fixedHeight) return false
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

  resizeChildrenByHeight({initiator, newInitiatorHeight, newInitiatorBase, newParentHeight}){
    const profiles = this.getProfiles({initiator, newInitiatorBase})
    const totalProfileSize = profiles.reduce((a, p) => a + p, 0)
    const fixedChildren = this.children.filter(c => c === initiator || c.state.fixedHeight)
    const freeChildren = this.children.filter(c => c !== initiator && !c.state.fixedHeight)
    if(freeChildren.length === 0) return false
    const totalSize = newParentHeight || this.height
    const totalFixedChildrenSize = fixedChildren.reduce((a, c) => {
                let childSize = (c === initiator) ? newInitiatorHeight : c.height
                return a + childSize
                }, 0)
    const partFreeSize = Math.round((totalSize - totalFixedChildrenSize - totalProfileSize) / freeChildren.length)
    let x = this.rect.x
    let y = this.rect.y
    let dy = 0
    const ch = this.children
    let total = 0
    let partSize
    for(let i = 0; i < ch.length - 1; i++) {
      partSize = (ch[i] === initiator) ? newInitiatorHeight : ch[i].height
      if(ch[i] !== initiator && !ch[i].state.fixedHeight) partSize = partFreeSize
      if(!ch[i].checkHeight(partSize)) return false
      dy += partSize + profiles[i]
      total += partSize + profiles[i]
      ch[i].savePosition(x, y)
      y += dy 
    }
    partSize = totalSize - total
    if(!ch.at(-1).checkHeight(partSize)) return false
    ch.at(-1).savePosition(x, y)
    return true
  }

  resizeChildrenByWidth({initiator, newInitiatorWidth, newInitiatorBase, newParentWidth}){
    const profiles = this.getProfiles({initiator, newInitiatorBase})
    const totalProfileSize = profiles.reduce((a, p) => a + p, 0)
    const fixedChildren = this.children.filter(c => c === initiator || c.state.fixedWidth)
    const freeChildren = this.children.filter(c => c !== initiator && !c.state.fixedWidth)
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
    const ch = this.children
    let total = 0
    let partSize
    for(let i = 0; i < ch.length - 1; i++) {
      partSize = (ch[i] === initiator) ? newInitiatorWidth : ch[i].width
      if(ch[i] !== initiator && !ch[i].state.fixedWidth) partSize = partFreeSize
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

  setHeight(height){
    if(this.parent.divided === FasadeShape.HOR) {
        const result = this.parent.resizeChildrenByHeight({initiator: this, newInitiatorHeight: height})
        if(result) this.parent.applyChanges()
      }else{
        const result = this.parent.parent.resizeChildrenByHeight({initiator: this.parent, newInitiatorHeight: height})
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
  checkHeight(height){
    if(height < this.minHeight) return false
    if(this.state.fixedHeight && height !== this.height) return false
    if(this.hasChildren()){
      if(this.divided === FasadeShape.HOR) {
          const result = this.resizeChildrenByHeight({newParentHeight: height})
          if(result) this.savedHeight = height
          return result
        }
      if(this.children.some(c => !c.checkHeight(height))) return false 
    }
    this.savedHeight = height
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
    if(this.savedHeight) this.height = this.savedHeight
    //if(this.savedPosition) this.setPosition(this.savedPosition.x, this.savedPosition.y)
    //this.savedPosition = null
    this.savedHeight = null
    this.savedWidth = null
    let x = this.rect.x 
    let y = this.rect.y
    if(this.hasChildren()) {
        let width
        let height
        for(let i = 0; i < this.children.length - 1; i++){
                let c = this.children[i]
                let cNext = this.children[i + 1]
                let profile = getProfile(c.base, cNext.base)
                width = c.savedWidth || c.width
                height = c.savedHeight || c.height
                c.setPosition(x, y, {width, height})
                if(this.divided === FasadeShape.VERT) {
                  x += width + profile
                }else{
                  y += height + profile
                }
                c.applyChanges()
              }
        width = this.children.at(-1).savedWidth || this.children.at(-1).width
        height = this.children.at(-1).savedHeight || this.children.at(-1).height
        this.children.at(-1).setPosition(x, y, {width, height})
        this.children.at(-1).applyChanges()
      }
  }

  getProfiles({initiator, newBase = initiator && initiator.base} = {}){
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
    this.rect.last = { x: x + width || this.width, y: y + height || this.height };
  }
  getPosition() {
    return this.rect;
  }
  setHidden(hidden) {
    this.state.hidden = hidden;
  }
  getSingleDimensionData(vertical){
    const firstPoint = vertical ? {x: this.rect.x + this.width / 2, y: this.rect.y} : {x: this.rect.x, y: this.rect.y + this.height / 2}
    const secondPoint = vertical ? {x: this.rect.x + this.width / 2, y: this.rect.last.y} : {x: this.rect.last.x, y: this.rect.last.y - this.height / 2}
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
