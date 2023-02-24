import SelectCursor from "../components/shapes/cursors/SelectCursor";
import { captions } from '../locale/ru.js';
import { getNewDate, isMobile, Status } from "./functions";
import jwtDecode from "jwt-decode";
import PanelShape from "../components/shapes/PanelShape";

var user = { name: "", activated: false };
var token = localStorage.getItem('token') || sessionStorage.getItem('token');
if (!token) {
  const cookieToken = document.cookie.split("; ").map(i => i.split("=")).find(i => i[0] === 'token')
  if (Array.isArray(cookieToken)) token = cookieToken[1]
}

if (token) {
  user = jwtDecode(token)
  user.token = token;
}
const leg = 30
const panels = [
  new PanelShape({ id: 0, name: "Крыша", length: 2200, vertical: false, position: { x: 0, y: 2154 + leg }}),
  new PanelShape({ id: 1, name: "Дно", length: 2200, vertical: false, position: { x: 0, y: leg } }),
  new PanelShape({ id: 2, name: "Стойка боковая", length: 2138, vertical: true, position: { x: 0, y: 16 + leg } }),
  new PanelShape({ id: 3, name: "Стойка боковая", length: 2138, vertical: true, position: { x: 2184, y: 16 + leg } }),
  new PanelShape({ id: 4, name: "Стойка", length: 2138, vertical: true, position: { x: 500, y: 16 + leg }, selectable: true }),
  new PanelShape({ id: 5, name: "Полка плат", length: 1668, vertical: false, position: { x: 516, y: 1800 }, selectable: true }),
  new PanelShape({ id: 6, name: "Стойка", length: 1754, vertical: true, position: { x: 1100, y: 46 }, selectable: true }),
  new PanelShape({ id: 7, name: "Стойка", length: 368, vertical: true, position: { x: 800, y: 1816 }, selectable: true }),
]
panels[4].jointFromFrontSide = [panels[5]]
panels[4].parallelFromBack = [panels[2]]
panels[4].parallelFromFront = [panels[6],panels[7],panels[3]]
panels[5].jointFromBackSide = [panels[6]]
panels[5].jointFromFrontSide = [panels[7]]
panels[5].parallelFromBack = [panels[1]]
panels[5].parallelFromFront = [panels[0]]
panels[6].parallelFromBack = [panels[2],panels[4]]
panels[6].parallelFromFront = [panels[3]]
panels[7].parallelFromBack = [panels[2],panels[4]]
panels[7].parallelFromFront = [panels[3]]
export function getInitialState() {
  return {
    cursor: new SelectCursor({ x: 0, y: 0 }),
    curShape: null,
    prevStatus: Status.FREE,
    selectedPanels: [],
    panels,
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
    user
  }
}