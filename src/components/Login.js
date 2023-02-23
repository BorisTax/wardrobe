import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Spinner from './Spinner';
import { AppActions } from '../actions/AppActions';
import CheckBox from './CheckBox';
import useActions from '../customHooks/useActions';
const messages = require('../messages')

export default function Login(props) {
    const refName = useRef();
    const refPass = useRef();
    const refDialog = useRef();
    const [state, setState] = useState({ correct: true, logging: false, showPass: false, remember: false, message: "" })
    const appActions = useActions()
    const captions = useSelector(store => store.captions.loginForm)
    const serverMessages = useSelector(store => store.captions.serverMessages)
    const onRegClick = () => {
        props.history.push('/register')
    }
    const onSubmit = (e) => {
        if (state.logging) return;
        const name = refName.current.value;
        const pass = refPass.current.value;
        requestLogin(name, pass);
        e.preventDefault();
    }
    const cancel = () => {
        props.history.push('/');
    }
    const requestLogin = (name, password)=>{
        setState({ correct: true, logging: true });
        fetch('/login',
            {
                method: 'POST', headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, password })
            })
            .then(res =>
                res.json())
            .then(res => {
                setState({ correct: res.success, logging: false, message: serverMessages[res.message]});
                if (res.success === true) {
                    appActions.setToken(res.token, state.remember);
                    props.history.push('/');
                }
            })
            .catch(e => { console.error(e); setState({ correct: false, logging: false, message: serverMessages[messages.SERVER_ERROR]}); });
    }

    useEffect(() => {
        window.KEYDOWNHANDLE = false
        setTimeout(() => { refDialog.current.style.width = "220px";}, 10)
        return ()=>{window.KEYDOWNHANDLE = true}
    }, [])

    const showPass = state.showPass ? "text" : "password"
    const message = state.message
    return <div className='modal-container noselect' onClick={AppActions.blink}>
        <div ref={refDialog} className={"toolbar-modal toolbar-animated shadow-box"} onClick={(e) => { e.stopPropagation() }}>
            <div className={"toolbar-header"}>
                <span className={"toolbarCaption"}>{captions.title}</span>
            </div>
            <form onSubmit={onSubmit} className='login-form'>
                <input name="nameOrEmail" ref={refName} required placeholder={captions.name} />
                <input name="password" ref={refPass} required placeholder={captions.password} type={showPass} />
                <input type='submit' value='OK' />
                <input type='button' value={captions.cancel} onClick={cancel} />
                <input type='button' value={captions.register} onClick={onRegClick} />
            </form>
            <CheckBox title={captions.showPass} value={state.showPass} onChange={(value) => { setState({...state, showPass: value }) }}/>
            <CheckBox title={captions.remember} value={state.remember} onChange={(value) => { setState({...state, remember: value }) }}/>
            <div className="flex-center">{state.logging ? <Spinner /> : <></>}</div>
            <span className={state.correct?"successMessages":"errorMessages"}>{message}</span>
        </div>
    </div>
}


