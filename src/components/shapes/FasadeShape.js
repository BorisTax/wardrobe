import Geometry, { Intersection } from "../../utils/geometry";
import Shape from "./Shape";
import ShapeStyle from "./ShapeStyle";
import { Color } from "../colors";
import { getProfile, selectAllChildrenFasades} from "../../reducers/panels";
import { PropertyTypes } from "./PropertyData";
import TextShape from "./TextShape";
import { FasadBase, getFasadBases } from "../../reducers/materialReducer";
import { CustomPaths, getCustomPath } from "./shapes";
import MultiTextShape from "./MultiTextShape";
export default class FasadeShape extends Shape {
  static VERT = "vert"
  static HOR = "hor"
  type = Shape.FASADE;
  constructor(data) {
    super();
    this.height = data.height;
    this.width = data.width;
    this.level = data.level === undefined ? 0 : data.level;
    this.parent = data.parent;
    this.base = data.base === undefined ? "" : data.base;
    this.baseColor = data.baseColor === undefined ? FasadBase.MIRROR : data.baseColor;
    if (this.level === 0) this.caption = new TextShape('ФАСАД', {x: data.position.x + data.width / 2, y: data.position.y - 50})
    const orientation = (this.parent && this.parent.divided) || FasadeShape.HOR
    this.baseCaption = new MultiTextShape([this.base, " " + this.base + this.base], {x:0, y:0}, orientation === FasadeShape.HOR ? 0 : -Math.PI / 2)
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
      { key: "name", 
        type: PropertyTypes.STRING, 
        editable: () => false, 
        getValue: () => this.name
      },
      { key: "height", 
        type: PropertyTypes.INTEGER_POSITIVE_NUMBER, 
        editable: () => this.isHeightEditable(), 
        extra: () => this.getHeightParts(), 
        getValue: () => this.height, 
        setValue: (value) => {this.setHeight(value)}
      },
      { key: "width", 
        type: PropertyTypes.INTEGER_POSITIVE_NUMBER, 
        editable: () => this.isWidthEditable(), 
        extra: () => this.getWidthParts(), 
        getValue: () => this.width, 
        setValue: (value) => {this.setWidth(value)}
      },
      { key: "base", 
        type: PropertyTypes.LIST, 
        items: (appData) => getFasadBases().map(b => appData.captions.toolbars.info.materials.fasadBases[b]), 
        editable: () => !this.hasChildren(), 
        getValue: (appData) => (this.isCombi() ? appData.captions.toolbars.info.materials.combi : appData.captions.toolbars.info.materials.fasadBases[this.getBase()]), 
        setValue: (index, _, appData) => {this.preSetBase(getFasadBases()[index]); this.setBaseColor(appData.materials[getFasadBases()[index]][0].name)}},
      { key: "baseColor", 
        type: PropertyTypes.LIST, 
        items: (appData) => appData.materials[this.base].map(m => m.name), 
        editable: () => !this.hasChildren(), 
        getValue: () => this.getBaseColor(), 
        setValue: (_, value) => this.setBaseColor(value)
      },
    ]
  }

  draw(ctx, realRect, screenRect, print = false, captions) {
    this.captions = captions
    let saveState = {...this.state}
    if(print) this.state = {...this.state, selected: false, highlighted: false}  
    super.draw(ctx, realRect, screenRect);
    const topLeft = Geometry.realToScreen(this.rect, realRect, screenRect);
    const bottomRight = Geometry.realToScreen(this.rect.last, realRect, screenRect);
    const width = bottomRight.x - topLeft.x;
    const height = bottomRight.y - topLeft.y;
    let x = topLeft.x
    let y = topLeft.y
    ctx.strokeRect(x, y, width, height);
    if(this.caption) this.caption.draw(ctx, realRect, screenRect, 14)
    if(this.baseCaption && !this.hasChildren()) this.baseCaption.draw(ctx, realRect, screenRect)
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
    if(this.baseCaption){
      const width  = Geometry.realToScreenLength(this.width, realRect.bottomRight.x - realRect.topLeft.x, screenRect.width)
      const height  = Geometry.realToScreenLength(this.height, realRect.bottomRight.x - realRect.topLeft.x, screenRect.width)
      const text1 = (this.captions && this.captions.toolbars.info.materials.fasadBases[this.base]) || this.base
      const text2 = this.getBaseColor()
      this.baseCaption.setText([text1, " " + text2])
      this.baseCaption.setFitRect({width, height})
      this.baseCaption.setPoint({x: (this.rect.x + this.rect.last.x) / 2, y: (this.rect.y + this.rect.last.y) / 2})
    }
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
    if(this.state.fixedHeight) return false
    return this.parent.divided === FasadeShape.VERT ? this.level > 1: true 
  }

  isWidthEditable(){
    if(this.level === 0) return false
    if(this.state.fixedWidth) return false
    return this.parent.divided === FasadeShape.HOR ? this.level > 1: true 
  }

  isCombi(){
    return this.hasChildren() && this.level === 0 && !this.children.every(c => c.base === this.children[0].base)
  }

  hasChildren(){
    return this.children.length > 0
  }
  deleteAllChildren(state){
    if(!this.hasChildren()) return
    const children = selectAllChildrenFasades(this.children)
    children.forEach(c => {
          state.fasades.delete(c); 
          c.dimensions.forEach(d => state.fasadeDimensions.delete(d))
        })
    this.children = []
  }
  resizeChildrenByHeight({initiator, newInitiatorHeight, newInitiatorBase, newParentHeight}){
    const profiles = this.getProfiles({initiator, newBase: newInitiatorBase})
    const totalProfileSize = profiles.reduce((a, p) => a + p, 0)
    const fixedChildren = this.children.filter(c => ((c === initiator) && newInitiatorHeight) || c.state.fixedHeight)
    const freeChildren = this.children.filter(c => ((c !== initiator) || !newInitiatorHeight) && !c.state.fixedHeight)
    if(freeChildren.length === 0) return false
    const totalSize = newParentHeight || this.height
    const totalFixedChildrenSize = fixedChildren.reduce((a, c) => {
                let childSize = (c === initiator) ? (newInitiatorHeight || c.height) : c.height
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
      partSize = (ch[i] === initiator) ? (newInitiatorHeight || partFreeSize) : ch[i].height
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
    const profiles = this.getProfiles({initiator, newBase: newInitiatorBase})
    const totalProfileSize = profiles.reduce((a, p) => a + p, 0)
    const fixedChildren = this.children.filter(c => ((c === initiator) && newInitiatorWidth) || c.state.fixedWidth)
    const freeChildren = this.children.filter(c => ((c !== initiator) || !newInitiatorWidth) && !c.state.fixedWidth)
    if(freeChildren.length === 0) return false
    const totalSize = newParentWidth || this.width
    const totalFixedChildrenSize = fixedChildren.reduce((a, c) => {
                let childSize = (c === initiator) ? (newInitiatorWidth || c.width) : c.width
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
      partSize = (ch[i] === initiator) ? (newInitiatorWidth || partFreeSize) : ch[i].width
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
        if(result) this.parent.applyChanges(); else this.discardChanges()
      }else{
        const result = this.parent.parent.resizeChildrenByHeight({initiator: this.parent, newInitiatorHeight: height})
        if(result) this.parent.parent.applyChanges(); else this.discardChanges()
      }
  }
  setWidth(width){
    if(this.parent.divided === FasadeShape.VERT) {
        const result = this.parent.resizeChildrenByWidth({initiator: this, newInitiatorWidth: width})
        if(result) this.parent.applyChanges(); else this.discardChanges()
      }else{
        const result = this.parent.parent.resizeChildrenByWidth({initiator: this.parent, newInitiatorWidth: width})
        if(result) this.parent.parent.applyChanges(); else this.discardChanges()
      }
  }


  preSetBase(base){
    let parent = this
    while (parent.level > 1) parent = parent.parent
    parent.setBase(base)
  }

  setBase(base){
    if(this.hasChildren()) this.children.forEach(c => c.setBase(base))
    if(!this.parent) {
      this.base = base;
      return
    }
    let result
    if(this.parent.divided === FasadeShape.VERT) {
        result = this.parent.resizeChildrenByWidth({initiator: this, newInitiatorBase: base})
      }else{
        result = this.parent.resizeChildrenByHeight({initiator: this, newInitiatorBase: base})
      }
    if(!result) return this.discardChanges()
    this.savedBase = base
    this.parent.applyChanges()
  }

  getBase(){
    return this.hasChildren() ? this.children[0].base : this.base
  }
  getBaseColor(){
    return this.hasChildren() ? this.children[0].baseColor : this.baseColor
  }
  setBaseColor(baseColor){
    this.baseColor = baseColor
    if(this.hasChildren()) this.children.forEach(c => c.setBaseColor(baseColor))
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
    if(this.savedBase) this.base = this.savedBase
    if(this.savedWidth) this.width = this.savedWidth
    if(this.savedHeight) this.height = this.savedHeight
    //if(this.savedPosition) this.setPosition(this.savedPosition.x, this.savedPosition.y)
    //this.savedPosition = null
    this.savedHeight = null
    this.savedWidth = null
    this.savedBase = null
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

  discardChanges(){
    this.savedHeight = null
    this.savedWidth = null
    this.savedBase = null
  }

  getProfiles({initiator, newBase = initiator && initiator.base} = {}){
    let profiles = []
    for(let i=0; i < this.children.length - 1; i++) {
      const base1 = this.children[i] === initiator ? (newBase || this.children[i].base) : this.children[i].base
      const base2 = this.children[i + 1] === initiator ? (newBase || this.children[i + 1].base) : this.children[i + 1].base
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
    const mult = 1;
    return (
      p.x >= this.rect.x - pixelRatio * mult &&
      p.x <= this.rect.x + this.rect.width + pixelRatio * mult &&
      p.y >= this.rect.y - pixelRatio * mult &&
      p.y <= this.rect.y + this.rect.height + pixelRatio * mult
    );
  }
}
