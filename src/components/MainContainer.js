import React from 'react';
import Header from './Header';
import ViewPortContainer from './ViewPortContainer';
import LeftSideBar from './LeftSideBar';
import MainToolBar from './MainToolBar';

export default function MainContainer(){
    return <div className={'main-container'}>
        <Header/>
        <MainToolBar/>
        <div className='work-container'>
        
           <LeftSideBar/>
           
            <div className={'viewport-container'}>
                <ViewPortContainer/>
            </div>
            
        </div>
        
    </div>
}

