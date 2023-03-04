import React from 'react';
import useActions from '../customHooks/useActions';
import Modal from './Modal';

export default function Alert(props){
    const appActions = useActions()
    return <Modal header={props.message}>
                    <hr/>
                    <div className="flex-center">
                    <button onClick={()=>{
                        appActions.showAlert(false)}}>OK</button>
                    </div>    
            </Modal>
}