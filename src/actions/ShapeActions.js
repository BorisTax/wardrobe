export const ShapeActions={
    CREATE_PANEL:'CREATE_PANEL',
    MOVE_PANEL:"MOVE_PANEL",
    SELECT_PANEL:'SELECT_PANEL',
    SET_PROPERTY:'SET_PROPERTY',
createPanel:(options)=> {
    return {
        type: ShapeActions.CREATE_PANEL,
        payload: options,
    }
},
movePanel:(panel,movePoint)=>{
    return {
      type: ShapeActions.MOVE_PANEL,
      payload:{panel,movePoint}
    };
  },
setProperty:(prop)=>{
    return {
        type:ShapeActions.SET_PROPERTY,
        payload:prop,
    }
}
}
