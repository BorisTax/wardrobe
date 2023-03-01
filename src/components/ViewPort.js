import React, { useEffect, useLayoutEffect, useRef } from 'react';
import ToolBar from './ToolBar.js';
import { paint } from '../functions/drawFunctions.js';
import { addWindowListeners, zoomToRect } from '../functions/viewPortFunctions.js';
import useEvents from '../customHooks/useEvents.js';
import useDoubleClick from '../customHooks/useDoubleClick.js';

export default function ViewPort({ viewPortData, setViewPortData, appActions, appData, eventHandlers }) {
    const events = useEvents(appData.isMobile, eventHandlers)
    const refCanvas = useRef()
    useEffect(() => {
        const ctx = refCanvas.current.getContext('2d')
        paint(ctx, viewPortData, appData)
    }, [appData, viewPortData])
    useLayoutEffect(() => {
        window.KEYDOWNHANDLE = true
        refCanvas.current.addEventListener("wheel", (e) => {
            eventHandlers.onMouseWheel(e);
            e.preventDefault();
        })
        addWindowListeners(viewPortData, setViewPortData, appActions, refCanvas.current)
    }, [])
    useEffect(() => {
        setViewPortData((prevData) => zoomToRect({ topLeft: { x: -1000, y: appData.wardrobe.height + 1000 }, bottomRight: { x: appData.wardrobe.width, y: -1000 } }, prevData));
    }, [appData.resetView])
    const doubleClick = useDoubleClick(eventHandlers, (e) => eventHandlers.onDoubleClick(e))
    return <ToolBar id={"canvas-container"} noTitle={true} wide={false}>
        <canvas ref={refCanvas} id="canvas" style={{ width: `${viewPortData.viewPortWidth}px`, height: `${viewPortData.viewPortHeight}px`, cursor: 'none' }} width={viewPortData.viewPortWidth} height={viewPortData.viewPortHeight}
            {...events}
            onClick={doubleClick}
            onDoubleClick={(e) => { eventHandlers.onDoubleClick(e) }}
            onContextMenu={(e) => { e.preventDefault() }}
        >
        </canvas>
    </ToolBar>
}

