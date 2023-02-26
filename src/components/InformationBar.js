import React from 'react';
import { useSelector } from 'react-redux';
import ToolBar from './ToolBar';
export default function InformationBar({disabled}){
    const captions = useSelector(store => store.captions.toolbars.info)
    const {width, height, depth} = useSelector(store => store.wardrobe)
    return <ToolBar caption={captions.title}>
        <div>
            <div>{`${width}x${depth}x${height}`}</div>
        </div>
    </ToolBar>
}
