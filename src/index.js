import React from 'react';
import {createRoot} from 'react-dom/client'
import App from './App';
import 'normalize.css';
import './styles/app.scss';
import './styles/buttons.scss';
import './styles/animation.scss';
import './styles/containers.scss';
import './styles/inputs.scss';
import './styles/toolbars.scss'
const container = document.getElementById('root')

createRoot(container).render(<App />);

function copy(){
        function clone(obj){
            const newObj={}
            for(const prop in obj){
                if(prop==='copy') continue;
                let cloneProp;
                if(typeof obj[prop] === 'object') cloneProp=clone(obj[prop]); else cloneProp=obj[prop];
                newObj[prop]=cloneProp;
                }
            return newObj;
        }
    return clone(this);
    }
// eslint-disable-next-line
Object.defineProperty(Object.prototype,'copy',{value:copy,enumerable:false});
// eslint-disable-next-line
Number.prototype.round4=function(){return Math.round(this*10000)/10000}
window.devicePixelRatio=2;

