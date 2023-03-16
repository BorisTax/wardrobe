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
    LOAD_MATERIALS: 'LOAD_MATERIALS',
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
    loadMaterials(dispatch){
        fetch('/materials',
        {
            method: 'POST', headers: { "Content-Type": "application/json" },
            //body: JSON.stringify({ name, password })
        })
        .then(res =>
            res.json())
        .then(res => {
                dispatch(ModelActions.setLoadedMaterials(res));
        })
        .catch(e => { console.error(e);});
        return {
            type: ModelActions.LOAD_MATERIALS
        }
    }
}
