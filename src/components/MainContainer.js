import React from 'react';
import Header from './Header';
import StatusBar from './StatusBar.js';
import ViewPortContainer from './ViewPortContainer';
import LeftSideBar from './LeftSideBar';
import RightSideBar from './RightSideBar';

export default function MainContainer(){
    return <div className={'main-container'}>
        <Header/>
        <StatusBar/>
        <div className='work-container'>
           <LeftSideBar/>
            <div className={'viewport-container'}>
                <ViewPortContainer/>
            </div>
            <RightSideBar/>
        </div>
    </div>
}

