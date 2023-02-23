import React from 'react';
import {NavLink} from 'react-router-dom';
import Clock from './Clock/clock';

export default class Main extends React.Component{
    render(){
        return <div>
            <Clock/>
            <NavLink to="/geomeditor"><h1>GeomEditor</h1></NavLink>
            </div>
    }
}