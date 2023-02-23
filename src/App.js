import React from 'react';
import {BrowserRouter,Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import {store} from './store/configureStore';
import Body from './Body';
import Login from './components/Login'
import Register from './components/Register';
export default function App(){
        return <Provider store={store}>
            <BrowserRouter>
                <Route path='/' component={Body}/>
                <Route path='/login' component={Login}/>
                <Route path='/register' component={Register}/>
            </BrowserRouter>
        </Provider>
}
