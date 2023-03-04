import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useActions from '../customHooks/useActions';
import { printToPDF } from '../reducers/printPdf';
import Modal from './Modal';
import Spinner from './Spinner';

export default function PrintPreviewBar(){
    const captions = useSelector(store => store.captions.toolbars.print)
    const appActions = useActions()
    const appData = useSelector(store => store)
    const [isLoading, setLoading] = useState(true)
    useEffect(()=>{
        setTimeout(()=>{printToPDF(appData); setLoading(false)},1)
    },[])
        return (
            <Modal header={captions.title} wide={true}>
                <iframe id="print-frame" name="print-frame" title="print-frame"
                onLoad={
                    function(e){
                        const frame = e.target
                        frame.style.width = '90vw';
                        frame.style.height = '90vh'
                        frame.style.display = 'block';
                        //frame.scrollIntoView({behavior:"smooth"})
                    }
                }
                />
                <div className="flex-center">{isLoading ? <Spinner /> : <></>}</div>
                <div className='flex-center'>
                    <button onClick={() => appActions.showDialog(false)}>{captions.close}</button>
                </div>
            </Modal>
        );
    }

