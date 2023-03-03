import React, { useRef, useState } from 'react';
import { AppActions } from '../actions/AppActions';

export default function Modal(props) {
    const [dragState, setDragState] = useState({ drag: false, x0: 0, y0: 0 })
    const refModal = useRef()
    return <div className='modal-container  noselect' onClick={AppActions.blink} >
        <div ref={refModal} className={"toolbar-modal shadow-box"}
            onClick={(e) => { e.stopPropagation() }}
            onPointerDown={(e) => {
                const rect = e.target.getBoundingClientRect();
                setDragState({ drag: true, x0: e.clientX - rect.left, y0: e.clientY - rect.top })
            }}
            onPointerMove={(e) => {
                if (dragState.drag) {
                    const rect = e.target.getBoundingClientRect();
                    const style = getComputedStyle(refModal.current)
                    const x = e.clientX - rect.left - dragState.x0 + parseInt(style.left)
                    const y = e.clientY - rect.top - dragState.y0 + parseInt(style.top)
                    refModal.current.style.left = `${x}px`
                    refModal.current.style.top = `${y}px`
                }
            }}
            onPointerLeave={() => { setDragState({ drag: false }) }}
            onPointerUp={() => { setDragState({ drag: false }) }}
        >
            {props.children}
        </div>
    </div >

}