import React, { useRef, useState } from 'react';
import { AppActions } from '../actions/AppActions';

export default function Modal(props) {
    const refHeader = useRef()
    const {onPointerDown, onPointerMove, onPointerLeave, onPointerUp} = useDragElement(refHeader)
    return <div className='modal-container noselect' onClick={AppActions.blink} >
        <div ref={refHeader} className={"toolbar-modal shadow-box"} style={props.wide?{display:"block",width:"100%"}:{}} onClick={(e) => { e.stopPropagation() }}>
        <div 
            style={{ maxWidth: "400px", wordWrap: "break-word", textAlign: "center" }}
            onPointerDown = {onPointerDown}
            onPointerMove = {onPointerMove}
            onPointerLeave = {onPointerLeave}
            onPointerUp = {onPointerUp}
            >
            {props.header}
           
            </div>
            {props.children}
        </div>
    </div>

}

function useDragElement(refElement){
    const [dragState, setDragState] = useState({ drag: false, x0: 0, y0: 0 })
    return{
    onPointerDown: (e) => {
        const rect = e.target.getBoundingClientRect();
        setDragState({ drag: true, x0: e.clientX - rect.left, y0: e.clientY - rect.top })
    },
    onPointerMove:(e) => {
        if (dragState.drag) {
            const rect = e.target.getBoundingClientRect();
            const style = getComputedStyle(refElement.current)
            const x = e.clientX - rect.left - dragState.x0 + parseInt(style.left)
            const y = e.clientY - rect.top - dragState.y0 + parseInt(style.top)
            refElement.current.style.left = `${x}px`
            refElement.current.style.top = `${y}px`
        }
    },
    onPointerLeave: () => { setDragState({ drag: false }) },
    onPointerUp: () => { setDragState({ drag: false }) }}
}