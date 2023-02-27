import React from 'react';
import PrintPreviewBar from './PrintPreviewBar';
import Header from './Header';
import StatusBar from './StatusBar.js';
import ViewPortContainer from './ViewPortContainer';
import LeftSideBar from './LeftSideBar';

export default function MainContainer(){
    return <div className={'main-container'}>
        <Header/>
        <StatusBar/>
        <div className='work-container'>
           <LeftSideBar/>
            <div className={'viewport-container'}>
                <ViewPortContainer/>
                <PrintPreviewBar />
            </div>
        </div>
    </div>
}

