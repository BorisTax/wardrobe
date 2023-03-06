import TableCellShape from './TableCellShape';
export default class TableShape {
    constructor(table) {
        this.table = table
        this.tableRows = []
        this.rowCount = table.length
        this.colCount = table[0].length
        this.topLeft = { x: 0, y: 0 }
        for (const row of table) {
            const tableRow = []
            for (const col of row) {
                tableRow.push(new TableCellShape(col))
            }
            this.tableRows.push(tableRow)
        }
    }

    draw(ctx, fontSize, printOptions = {}) {
        const { maxColWidth, maxRowHeight, maxRowTextHeight, maxSingleTextLineHeight, maxRowUnderlineHeight } = this.getMaxCellDimensions(ctx, fontSize)
        let y = this.topLeft.y
        this.tableRows.forEach((row, rowIndex) => {
            let x = 0
            const singleTextLineHeight = maxSingleTextLineHeight[rowIndex]
            const underlineHeight = maxRowUnderlineHeight[rowIndex]
            const height = maxRowHeight[rowIndex] + underlineHeight
            const textHeight = maxRowTextHeight[rowIndex]
            //const height = textHeight + underlineHeight
            row.forEach((col, colIndex) => {
                const width = maxColWidth[colIndex]
                col.setPosition(this.topLeft.x + x, y)
                col.setDimensions(width, height, textHeight, singleTextLineHeight)
                col.draw(ctx, fontSize)
                x += width
            })
            if ((printOptions) && ((printOptions.pageHeight - y) < height)) {
                if (printOptions.onEndPage) {
                    printOptions.onEndPage()
                    //ctx.fillStyle = "white"
                    ctx.clearRect(0, 0, 900, 900);
                    y = printOptions.topMargin
                }
            } else y += height
        })
        if (printOptions.onEndPage) printOptions.onEndPage(false)
    }

    getMaxCellDimensions(ctx, fontSize) {
        let maxColWidth = Array(this.colCount).fill(0)
        let maxRowHeight = Array(this.rowCount).fill(0)
        let maxRowTextHeight = Array(this.rowCount).fill(0)
        let maxRowUnderlineHeight = Array(this.rowCount).fill(0)
        let maxSingleTextLineHeight = Array(this.rowCount).fill(0)
        this.tableRows.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                const { width, height, textHeight, singleTextLineHeight, underlineHeight } = col.getOwnDimensions(ctx, fontSize)
                if (maxColWidth[colIndex] < width) maxColWidth[colIndex] = width
                if (maxRowHeight[rowIndex] < height) maxRowHeight[rowIndex] = height
                if (maxRowTextHeight[rowIndex] < textHeight) maxRowTextHeight[rowIndex] = textHeight
                if (maxRowUnderlineHeight[rowIndex] < underlineHeight) maxRowUnderlineHeight[rowIndex] = underlineHeight
                if (maxSingleTextLineHeight[rowIndex] < singleTextLineHeight) maxSingleTextLineHeight[rowIndex] = singleTextLineHeight
            })
        })
        return { maxColWidth, maxRowHeight, maxRowTextHeight, maxSingleTextLineHeight, maxRowUnderlineHeight }
    }

    getTableDimensions(ctx, fontSize) {
        const { maxColWidth, maxRowHeight, maxRowUnderlineHeight } = this.getMaxCellDimensions(ctx, fontSize)
        const totalWidth = maxColWidth.reduce((a, i) => a + i, 0)
        let totalHeight = 0
        maxRowHeight.forEach((rh, i) => totalHeight += rh + maxRowUnderlineHeight[i])
        return { totalWidth, totalHeight }
    }

    setPosition(x, y) {
        this.topLeft = { x, y }
    }

}