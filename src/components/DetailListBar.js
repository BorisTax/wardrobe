import React, { useState } from 'react';
import ToolBar from './ToolBar';
import useActions from '../customHooks/useActions';
import { useSelector } from 'react-redux';

export default function DetailListBar({disabled, listKey, caption}){
    const appActions = useActions()
    const captions = useSelector(store => store.captions.toolbars.detailList)
    const panels = useSelector(store => store.panels)

    const contents =  <div>
                        <input type="button" value="Вертикальная" onClick={()=>appActions.createPanel({vertical: true})}/>
                        <input type="button" value="Горизонтальная" onClick={()=>appActions.createPanel({vertical: false})}/>
                    </div>
    return <ToolBar caption={caption}>
            {contents}
    </ToolBar>

}
