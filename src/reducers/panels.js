
export function updateDetailList(state) {
    const removeList = new Set()
    for (const panel of state.panels) {
        let lonelyPanel = 0
        for (const listKey of ["primary", "secondary"]) {
            let index = 1
            for (const detail of state.detailList[listKey]) {
                if (panel.getId() === detail.id && panel.model.listKey === listKey) {
                    panel.model.origLength = detail.length
                    panel.model.origWidth = detail.width
                    panel.model.id = index
                    panel.model.module = detail.module
                    panel.refreshModel();
                    lonelyPanel = index
                }
                detail.id = index;
                index++;
            }
        }
        if (lonelyPanel === 0) removeList.add(panel)
    }
    state.panels = state.panels.filter(p => !removeList.has(p));
}


