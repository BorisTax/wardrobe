export const ModelActions = {
    NEW_PROJECT: "NEW_PROJECT",
    NEW_PROJECT_CONFIRM: "NEW_PROJECT_CONFIRM",
    SAVE_PROJECT: "SAVE_PROJECT",
    OPEN_PROJECT: "OPEN_PROJECT",
    OPEN_FAILURE: "OPEN_FAILURE",
    SET_PROJECT: "SET_PROJECT",
    SET_INFORMATION: 'SET_INFORMATION',
    SET_MATERIAL: 'SET_MATERIAL',
    SET_LOADED_MATERIALS: 'SET_LOADED_MATERIALS',
    SET_WARDROBE_DIMENSIONS: 'SET_WARDROBE_DIMENSIONS',
    LOAD_DETAIL_LIST: 'LOAD_DETAIL_LIST',
    SET_DELETE_CONFIRM: 'SET_DELETE_CONFIRM',
    SET_DETAIL_LIST: 'SET_DETAIL_LIST',
    UPDATE_STATE: "UPDATE_STATE",
    updateState() {
        return {
            type: ModelActions.UPDATE_STATE
        }
    },
    newProject(data) {
        return {
            type: ModelActions.NEW_PROJECT,
            payload: data
        }
    },
    newProjectConfirm(start) {
        return {
            type: ModelActions.NEW_PROJECT_CONFIRM,
            payload: start
        }
    },
    saveProject() {
        return {
            type: ModelActions.SAVE_PROJECT
        }
    },
    openProject() {
        return (dispatch) => {
            var input = document.createElement('input');
            input.type = 'file';
            input.accept = ".json";
            input.onchange = e => {
                const file = e.target.files[0];
                var reader = new FileReader();
                reader.readAsText(file, 'UTF-8');

                // here we tell the reader what to do when it's done reading...
                reader.onload = readerEvent => {
                    try {
                        var content = JSON.parse(readerEvent.target.result);
                    } catch (e) {
                        content = {}
                    }
                    dispatch({ type: ModelActions.SET_PROJECT, payload: content });
                }
            }
            input.click();
        }
    },
    setInformation: (info) => {
        return {
            type: ModelActions.SET_INFORMATION,
            payload: info,
        }
    },
    setWardrobeDimensions: (dimensions) => {
        return {
            type: ModelActions.SET_WARDROBE_DIMENSIONS,
            payload: dimensions,
        }
    },
    setMaterial: (mat) => {
        return {
            type: ModelActions.SET_MATERIAL,
            payload: mat,
        }
    },
    setLoadedMaterials: (mat) => {
        return {
            type: ModelActions.SET_LOADED_MATERIALS,
            payload: mat
        }
    },
    setDeleteConfirm: (value) => {
        return {
            type: ModelActions.SET_DELETE_CONFIRM,
            payload: value
        }
    },
    loadDetailList: (listKey) => {
        return (dispatch) => {
            var input = document.createElement('input');
            input.type = 'file';
            input.accept = ".list";
            input.onchange = e => {
                const file = e.target.files[0];
                var reader = new FileReader();
                reader.readAsText(file, 'UTF-8');
                reader.onload = readerEvent => {
                    var content = readerEvent.target.result;
                    dispatch({ type: ModelActions.SET_DETAIL_LIST, payload: { listKey, data: makeDetailList(content, listKey) } });
                }
            }
            input.click();
        }
    }
}

function makeDetailList(content, listKey) {
    let error = false;
    let info;
    const newList = []
    try {
        const lines = content.split('\r\n').filter((i, _) => i !== "")
        info = lines.filter((_, index) => index <= 4);
        info = info.map((i) => i.split('='));
        if ((info[0][0] !== "Order") || (info[1][0] !== "Plan") || (info[2][0] !== "Material") || (info[3][0] !== "Gloss") || (info[4][0] !== "Texture")) return { error: true }
        info = {
            order: info[0][1],
            plan: info[1][1],
            material: { name: info[2][1], gloss: info[3][1] === 'True' ? true : false, texture: info[4][1] === 'True' ? true : false }

            ,
        }

        let list = lines.filter((_, index) => index > 4);
        list = list.map((i) => i.split(';'))
        let index = 0;
        for (const i of list) {
            index++;
            newList.push({ listkey: listKey, module: i[0], id: index, name: i[1], length: +i[2], width: +i[3], count: +i[4], created: 0, placed: 0 })
        }
    } catch (e) { error = true }
    return { list: newList, info, error };
}

