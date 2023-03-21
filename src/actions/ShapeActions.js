export const ShapeActions = {
    ADD_DIMENSION: 'ADD_DIMENSION',
    CREATE_DRAWER: 'CREATE_DRAWER',
    CREATE_DRAWERBLOCK: 'CREATE_DRAWERBLOCK',
    CREATE_PANEL: 'CREATE_PANEL',
    CREATE_SINGLE_DIMENSION: 'CREATE_SINGLE_DIMENSION',
    CREATE_TWO_PANEL_DIMENSION: 'CREATE_TWO_PANEL_DIMENSION',
    CREATE_TUBE: 'CREATE_TUBE',
    DELETE_SELECTED: "DELETE_SELECTED",
    DELETE_SELECTED_CONFIRM: "DELETE_SELECTED_CONFIRM",
    DISTRIBUTE: "DISTRIBUTE",
    DIVIDE_FASAD_HOR: "DIVIDE_FASAD_HOR",
    DIVIDE_FASAD_VERT: "DIVIDE_FASAD_VERT",
    FIX_LENGTH: "FIX_LENGTH",
    MOVE_PANEL: "MOVE_PANEL",
    SELECT_PANEL: 'SELECT_PANEL',
    SET_PANEL_STATE: 'SET_PANEL_STATE',
    SET_PROPERTY: 'SET_PROPERTY',
    addDimension: (dimension) => {
        return {
            type: ShapeActions.ADD_DIMENSION,
            payload: dimension,
        }
    },
    createDrawer: () => {
        return {
            type: ShapeActions.CREATE_DRAWER,
        }
    },
    createDrawerBlock: () => {
        return {
            type: ShapeActions.CREATE_DRAWERBLOCK,
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
    createTwoPanelDimension: ({inside}) => {
        return {
            type: ShapeActions.CREATE_TWO_PANEL_DIMENSION,
            payload: {inside}
        }
    },
    createTube: () => {
        return {
            type: ShapeActions.CREATE_TUBE,
        }
    },
    deleteSelected: () => {
        return {
          type: ShapeActions.DELETE_SELECTED
        };
      },
    deleteSelectedConfirm: ({isJoints}) => {
        return {
          type: ShapeActions.DELETE_SELECTED_CONFIRM,
          payload: {isJoints}
        };
      },
    distribute: () => {
        return {
            type: ShapeActions.DISTRIBUTE,
        };
    },
    divideFasadHor: (count) => {
        return {
            type: ShapeActions.DIVIDE_FASAD_HOR,
            payload: count
        };
    },
    divideFasadVert: (count) => {
        return {
            type: ShapeActions.DIVIDE_FASAD_VERT,
            payload: count
        };
    },
    fixLength: (min, max) => {
        return {
            type: ShapeActions.FIX_LENGTH,
            payload: {min, max}
        };
    },
    movePanel: (panel, movePoint) => {
        return {
            type: ShapeActions.MOVE_PANEL,
            payload: { panel, movePoint }
        };
    },
    setPanelState: (state) => {
        return {
            type: ShapeActions.SET_PANEL_STATE,
            payload: state,
        }
    },
    setProperty: (key, value) => {
        return {
            type: ShapeActions.SET_PROPERTY,
            payload: {key, value},
        }
    }
}
