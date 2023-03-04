import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useActions from '../customHooks/useActions';
import Modal from './Modal';

export default function Confirm(props){
        const dispatch = useDispatch()
        const appActions = useActions()
        const captions = useSelector(store => store.captions)
        return <Modal header={captions.messages[props.messageKey]}>
                        <div className="flex-center">
                        {props.actions.map((action, index)=>
                            <button key={index} 
                                    onClick={()=>{
                                        dispatch(action.onClick());
                                        appActions.showConfirm(false)}}>
                                    {action.caption}
                            </button>)}
                        <button onClick={() => appActions.showConfirm(false)}>{captions.buttons.cancel}</button>
                        </div>
                </Modal>

}