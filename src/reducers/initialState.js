import SelectCursor from "../components/shapes/cursors/SelectCursor";
import { captions } from '../locale/ru.js';
import { getNewDate, isMobile, Status } from "./functions";
import jwtDecode from "jwt-decode";
import PanelShape from "../components/shapes/PanelShape";

var user = {name:"", activated: false};
var token = localStorage.getItem('token') || sessionStorage.getItem('token');
if(!token) { 
    const cookieToken = document.cookie.split("; ").map(i=>i.split("=")).find(i=>i[0]==='token')
    if(Array.isArray(cookieToken)) token = cookieToken[1]
    }

if (token) {
  user = jwtDecode(token)
  user.token = token;
}


export function getInitialState(){
    return {cursor: new SelectCursor({ x: 0, y: 0 }),
    curShape: null,
    prevStatus: Status.FREE,
    selectedPanels: [],
    panels: [
            new PanelShape({ id: 1, name: "Крыша", length: 2200, vertical: false, position: {x:0,y:2354} }),
            new PanelShape({ id: 2, name: "Дно", length: 2200, vertical: false, position: {x:0,y:0} }),
            new PanelShape({ id: 3, name: "Стойка", length: 2338, vertical: true, position: {x:0,y:16} }),
            new PanelShape({ id: 4, name: "Стойка", length: 2338, vertical: true, position: {x:2184,y:16} })
    ],
    deleteConfirm: true,
    information: { order: "", plan: "", currentDate: getNewDate() },
    showLoading: false,
    showConfirm: { show: false, message: "" },
    showAlert: { show: false, message: "" },
    snapDist: 20, snapMinDist: 10,
    status: Status.FREE,
    statusBar: 5,
    statusParams: { creator: null, picker: null },
    isMobile: isMobile(),
    captions,
    user}
}