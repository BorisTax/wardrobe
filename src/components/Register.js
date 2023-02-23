import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Spinner from "./Spinner";
import { AppActions } from "../actions/AppActions";
import CheckBox from "./CheckBox";
import ToolButton from "./ToolButton";
import useActions from "../customHooks/useActions";
const messages = require('../messages')

export default function Register(props) {
  const refName = useRef();
  const refEmail = useRef();
  const refPass1 = useRef();
  const refPass2 = useRef();
  const refDialog = useRef();
  const appActions = useActions()
  const captions = useSelector((store) => store.captions.registerForm);
  const serverMessages = useSelector(store => store.captions.serverMessages);
  const [state, setState] = useState({
    correct: false,
    errCode: 0,
    fetching: false,
    showPass: false,
  });

  const onSubmit = (e) => {
    const name = refName.current.value;
    const email = refEmail.current.value;
    const pass1 = refPass1.current.value;
    const pass2 = refPass2.current.value;
    const checkResult = check(name, email, pass1, pass2);
    checkResult.message = serverMessages[checkResult.message];
    if (checkResult.correct) {
      setState(prev => ({ ...prev, fetching: true }));
      fetchData(
        "/register",
        { name: name, email: email, password: pass1 },
        regSucceedCallback,
        regFailCallback,
        regErrorCallback
      );
    } else setState({ ...checkResult });
    e.preventDefault();
  };
  const regSucceedCallback = (token) => {
    appActions.showAlert(true, serverMessages[messages.REG_SUCCEED]);
    appActions.setToken(token);
    props.history.push("/");
    setState({ correct: true, fetching: false });
  };
  const regFailCallback = (message) => {
    setState({ correct: false, fetching: false, message: serverMessages[message] });
  };
  const regErrorCallback = (err) => {
    setState({
      correct: false,
      fetching: false,
      message: serverMessages[messages.SERVER_ERROR],
    });
  };
  const cancel = () => {
    props.history.push("/");
  };
  const login = () => {
    props.history.push("/login");
  };
  const changeInputs = () => {
    setState((prev) => ({ ...prev, message: "" }));
  };

  const isNameExist = (name) => {
    if (!checkName(name)) return setState(prev => ({ ...prev, correct: false, message: serverMessages[messages.INVALID_NAME] }))
    setState(prev => ({ ...prev, fetching: true, message: "" }))
    fetchData("/checkname",
      { name },
      () => { setState(prev => ({ ...prev, correct: true, fetching: false, message: serverMessages[messages.USER_NAME_ALLOWED] })) },
      () => { setState(prev => ({ ...prev, correct: false, fetching: false, message: serverMessages[messages.USER_NAME_EXIST] })) },
      regErrorCallback
    );
  };
  const isEmailExist = (email) => {
    if (!checkEmail(email)) return setState(prev => ({ ...prev, correct: false, message: serverMessages[messages.INVALID_EMAIL] }))
    setState(prev => ({ ...prev, fetching: true, message: "" }))
    fetchData("/checkemail",
      { email },
      () => { setState(prev => ({ ...prev, correct: true, fetching: false, message: serverMessages[messages.USER_EMAIL_ALLOWED] })) },
      (message) => { setState(prev => ({ ...prev, correct: false, fetching: false, message: serverMessages[message] })) },
      regErrorCallback
    );
  };
  useEffect(() => {
    window.KEYDOWNHANDLE = false;
    setTimeout(() => {
      refDialog.current.style.width = "220px";
    }, 10);
    return () => {
      window.KEYDOWNHANDLE = true;
    };
  }, []);

  const showPass = state.showPass ? "text" : "password";
  const message = state.message;
  return (
    <div className="modal-container noselect" onClick={AppActions.blink}>
      <div ref={refDialog} className={"toolbar-modal toolbar-animated shadow-box"} onClick={(e) => {e.stopPropagation();}}>
        <div className={"toolbar-header"}>
          <span className={"toolbarCaption"}>{captions.title}</span>
        </div>
        <form onSubmit={onSubmit} className="login-form">
          <div className="input-row">
            <input required ref={refName} placeholder={captions.name} onChange={changeInputs}/>
            <ToolButton icon={"refresh"} title={captions.checkName} onClick={() => { isNameExist(refName.current.value) }} />
          </div>
          <div className="input-row">
            <input required ref={refEmail} placeholder={captions.email} type="email" onChange={changeInputs}/>
            <ToolButton icon={"refresh"} title={captions.checkEmail} onClick={() => { isEmailExist(refEmail.current.value) }} />
          </div>
          <input required ref={refPass1} placeholder={captions.password} type={showPass} onChange={changeInputs}/>
          <input required ref={refPass2} placeholder={captions.passwordAgain} type={showPass} onChange={changeInputs}/>
          <input type="submit" value="OK" />
          <input type="button" value={captions.cancel} onClick={cancel} />
          <input type="button" value={captions.login} onClick={login} />
        </form>
        <CheckBox title={captions.showPass} value={state.showPass} onChange={(value) => { setState({ showPass: value });}}/>
        <div className="flex-center">{state.fetching ? <Spinner /> : <></>}</div>
        <span className={state.correct ? "successMessages" : "errorMessages"}>{message}</span>
      </div>
    </div>
  );
}

const fetchData = (url, data, onSuccess, onFail, onError) => {
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.success) onSuccess(res.token);
      else onFail(res.message);
    })
    .catch((err) => {
      onError(err);
    });
};

const check = (name, email, pass1, pass2) => {
  let message = messages.NO_ERROR
  let state = { correct: true };
  if (pass2 !== pass1) message = messages.PASSWORDS_NOT_MATCH;
  if (pass1.length < 6) message = messages.INVALID_PASSWORD
  if (!checkEmail(email)) message = messages.INVALID_EMAIL
  if (!checkName(name)) message = messages.INVALID_NAME
  if (message !== messages.NO_ERROR) state = { correct: false, message };
  return state;
};
const checkName = (name) => {
  return name.match(/^[a-zA-Z0-9]+([a-zA-Z0-9](_)[a-zA-Z0-9])*[a-zA-Z0-9]+$/) && (name.length >= 4)
}
const checkEmail = (email) => {
  return email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)
}
