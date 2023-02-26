export const ShapeActions = {
    ADD_DIMENSION: 'ADD_DIMENSION',
    CREATE_PANEL: 'CREATE_PANEL',
    CREATE_SINGLE_DIMENSION: 'CREATE_SINGLE_DIMENSION',
    MOVE_PANEL: "MOVE_PANEL",
    SELECT_PANEL: 'SELECT_PANEL',
    SET_PROPERTY: 'SET_PROPERTY',
    addDimension: (dimension) => {
        return {
            type: ShapeActions.ADD_DIMENSION,
            payload: dimension,
        }
    },
    createPanel: (options) => {
        return {
            type: ShapeActions.CREATE_PANEL,
            payload: options,
        }
    },
    createSingleDimension: () => {
        return {
            type: ShapeActions.CREATE_SINGLE_DIMENSION,
        }
    },
    movePanel: (panel, movePoint) => {
        return {
            type: ShapeActions.MOVE_PANEL,
            payload: { panel, movePoint }
        };
    },
    setProperty: (prop) => {
        return {
            type: ShapeActions.SET_PROPERTY,
            payload: prop,
        }
    }
}
