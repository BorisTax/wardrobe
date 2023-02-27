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


function createNewState({ wardrobe = { width: 2400, height: 2200, depth: 600 } }) {
  const leg = 30
  const panels = [
    new PanelShape({ id: 0, name: "Крыша", length: wardrobe.width, vertical: false, position: { x: 0, y: wardrobe.height - 16 }, gabarit: true }),
    new PanelShape({ id: 1, name: "Дно", length: wardrobe.width, vertical: false, position: { x: 0, y: leg }, moveable: false , gabarit: true }),
    new PanelShape({ id: 2, name: "Стойка боковая", length: wardrobe.height - 32 - leg, vertical: true, position: { x: 0, y: 16 + leg }, moveable: false, gabarit: true  }),
    new PanelShape({ id: 3, name: "Стойка боковая", length: wardrobe.height - 32 - leg, vertical: true, position: { x: wardrobe.width - 16, y: 16 + leg }, selectable: true, gabarit: true }),
  ]
  panels[0].jointFromBackSide = [panels[2], panels[3]]
  panels[0].parallelFromBack = [panels[1]]
  panels[1].jointFromFrontSide = [panels[2], panels[3]]
  panels[1].parallelFromFront = [panels[0]]
  panels[2].jointFromFrontSide = [panels[0], panels[1]]
  panels[2].parallelFromFront = [panels[3]]
  panels[3].jointFromBackSide = [panels[0], panels[1]]
  panels[3].parallelFromBack = [panels[2]]
  return { wardrobe, panels }
}
export function getInitialState(data) {
  const { wardrobe, panels } = createNewState(data)
  return {
    cursor: new SelectCursor({ x: 0, y: 0 }),
    curShape: null,
    prevStatus: Status.FREE,
    selectedPanels: [],
    dimensions: [],
    panels,
    deleteConfirm: true,
    wardrobe,
    minDist: 100,
    toolButtonsPressed: {
      createVertical: false,
      createHorizontal: false,
      createSingleDimension: false,
      createTwoPanelDimension: false,
    },
    information: { order: "", plan: "", currentDate: getNewDate() },
    showLoading: false,
    showConfirm: { show: false, message: "" },
    showAlert: { show: false, message: "" },
    showDialog: { show: false, dialog: null },
    status: Status.FREE,
    statusBar: 5,
    statusParams: { creator: null, picker: null },
    isMobile: isMobile(),
    captions,
    user
  }
}