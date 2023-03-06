import TextShape from './TextShape';
export default class TableCellShape {
    constructor({ text, underlines = [], frame = true, padding = 2, align = TextShape.CENTER, weight = TextShape.NORMAL }) {
        this.topLeft = { x: 0, y: 0 }
        this.align = align;
        this.caption = text
        this.captionShape = new TextShape(this.caption, underlines, null, null, weight)
        this.padding = padding
        this.frame = frame
    }
    draw(ctx, fontSize) {
        let width
        let height
        if (!this.width) {
            ({ width, height } = this.getOwnDimensions(ctx, fontSize))
        } else {
            width = this.width
            height = this.height
        }
        let point = {};
        switch (this.align) {
            case TextShape.CENTER:
                point = {
                    x: this.topLeft.x + width / 2,
                    y: this.topLeft.y + height / 2
                }
                break;
            case TextShape.LEFT:
                point = {
                    x: this.topLeft.x,
                    y: this.topLeft.y + height / 2
                }
                break;
            case TextShape.RIGHT:
                point = {
                    x: this.topLeft.x + width,
                    y: this.topLeft.y + height / 2
                }
                break;
            default:
        }
        point.y = this.topLeft.y + this.singleTextLineHeight
        this.captionShape.setBasePoint(point);
        this.captionShape.setAnchor({ horizontal: this.align, vertical: TextShape.CENTER });
        this.captionShape.draw(ctx, fontSize)
        ctx.lineWidth = 1
        if (this.frame) ctx.strokeRect(Math.trunc(this.topLeft.x) + 0.5, Math.trunc(this.topLeft.y) + 0.5, Math.trunc(width), Math.trunc(height))
    }
    setPosition(x, y) {
        this.topLeft = { x, y }
    }
    setAlign(align) {
        this.align = align
    }
    setText(text) {
        this.caption.setText(text);
    }
    setFont(fontSize) {
        this.fontSize = fontSize
    }
    getOwnDimensions(ctx, fontSize) {
        ctx.font = `${fontSize}px serif`;
        let { width, height, textHeight, singleTextLineHeight, underlineHeight } = this.captionShape.getTextRect(ctx, fontSize)
        width += this.padding * 2
        height += this.padding * 2
        return { width, height, textHeight, singleTextLineHeight, underlineHeight };
    }
    setDimensions(width, height, textHeight, singleTextLineHeight) {
        this.width = width
        this.height = height
        this.textHeight = textHeight
        this.singleTextLineHeight = singleTextLineHeight
        this.captionShape.setDimensions(width, height, textHeight, singleTextLineHeight)
    }
    getDimensions(ctx) {
        if (!this.width) return this.getOwnDimensions(ctx)
        return { width: this.width, height: this.height };
    }
}