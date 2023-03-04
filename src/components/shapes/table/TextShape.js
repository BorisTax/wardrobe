

export default class TextShape{
    static CENTER='center';
    static LEFT='left';
    static RIGHT='right';
    static TOP='top';
    static BOTTOM='bottom';
    constructor(text=[''], underlines=[],point={x:0,y:0},anchor={vertical:TextShape.CENTER,horizontal:TextShape.CENTER}){
        this.p=point;
        this.text=text;
        this.anchor=anchor;
        this.lineBreak = 0
        this.underlines = underlines
        this.width = 0
        this.height = 0
    }
    draw(ctx, fontSize){
        //let width = this.width
        let height = this.height
        const {width: textWidth} = this.getTextRect(ctx, fontSize);
        let x=0
        let y=0
        switch(this.anchor.horizontal){
            case TextShape.CENTER:
                x = this.basePoint.x - textWidth / 2
                break;
            case TextShape.LEFT:
                x = this.basePoint.x + 2;
                break;
            case TextShape.RIGHT:
                x = this.basePoint.x - textWidth - 2;
                break;
            default:
        }
        switch(this.anchor.vertical){
            case TextShape.CENTER:
                y = this.basePoint.y
                break;
            case TextShape.TOP:
                y = this.basePoint.y - height/2
                break;
            case TextShape.BOTTOM:
                y = this.basePoint.y;
                break;
            default:
        }
        ctx.font=`${fontSize}px serif`;
        ctx.lineWidth = 1
        for(const t of this.text){
            ctx.fillStyle = "black"
            ctx.fillText(t, x, y);
            y += (this.singleTextLineHeight + this.lineBreak-2)
        }
        y = this.basePoint.y
        this.underlines.reduce((prevLine,line)=>{
            y += (line + prevLine)
            ctx.beginPath()
            ctx.lineWidth = line
            ctx.moveTo(x, Math.trunc(y) + 0.5)
            ctx.lineTo(x + textWidth, Math.trunc(y) + 0.5)
            ctx.stroke()
            return line
            //y += (line+2)
        },0)
    }
    getTextRect(ctx,fontSize){
        ctx.font = `${fontSize}px serif`;
        let width = 0
        let height = 0
        let singleTextLineHeight = 0
        let textHeight = 0
        for(const t of this.text){
            const textMetrics = ctx.measureText(t)
            if(width < textMetrics.width) width = textMetrics.width
            singleTextLineHeight = textMetrics.actualBoundingBoxAscent + textMetrics.fontBoundingBoxDescent
            height += singleTextLineHeight
        }
        const underlineHeight = this.underlines.length>0?this.underlines.reduce((a,i)=>a+i,0):0
        textHeight = height
        height += (this.text.length - 1) * this.lineBreak + underlineHeight
        width = Math.trunc(width)
        height = Math.trunc(height)
        singleTextLineHeight = Math.trunc(singleTextLineHeight)
        return {width, height, textHeight, singleTextLineHeight, underlineHeight};
    }

    setText(text){
        this.text=text;
    }
    setFont(font){
        this.font=font;
    }
    setPoint(point){
        this.p=point;
    }
    setBasePoint(point){
        this.basePoint={...point, y:point.y};
    }
    setAnchor(anchor){
        this.anchor={...this.anchor,...anchor};
    }
    setDimensions(width, height, textHeight, singleTextLineHeight){
        this.width = width
        this.height = height
        this.textHeight = textHeight
        this.singleTextLineHeight = singleTextLineHeight
    }


}