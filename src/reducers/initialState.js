import SelectCursor from "../components/shapes/cursors/SelectCursor";
import { captions } from '../locale/ru.js';
import { getNewDate, isMobile, Status } from "./functions";
import jwtDecode from "jwt-decode";
import PanelShape from "../components/shapes/PanelShape";
import DoublePanelShape from "../components/shapes/DoublePanelShape";

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


function createNewState({ wardrobe = { width: 3000, height: 2200, depth: 600, double: true } }) {
  const width = wardrobe.double ? wardrobe.width / 2 : wardrobe.width
  const leg = 30
  let panels
  if(!wardrobe.double){
    panels = [
      new PanelShape({ id: 0, wardrobe, name: "Крыша", length: width, vertical: false, position: { x: 0, y: wardrobe.height - 16 }, fixed_move: true, fixed_minlength: true, fixable: false, deletable: false, gabarit: true }),
      new PanelShape({ id: 1, wardrobe, name: "Дно", length: width, vertical: false, position: { x: 0, y: leg }, fixed_move: true, fixed_minlength: true, fixable: false, deletable: false, gabarit: true }),
      new PanelShape({ id: 2, wardrobe, name: "Стойка боковая", length: wardrobe.height - 32 - leg, vertical: true, position: { x: 0, y: 16 + leg }, fixed_move: true, fixed_minlength: true, fixable: false, deletable: false, gabarit: true  }),
      new PanelShape({ id: 3, wardrobe, name: "Стойка боковая", length: wardrobe.height - 32 - leg, vertical: true, position: { x: width - 16, y: 16 + leg }, fixed_move: true, fixed_minlength: true, fixable: false, deletable: false, gabarit: true }),
    ]
    panels[0].jointFromBackSide = new Set([panels[2], panels[3]])
    panels[0].parallelFromBack = new Set([panels[1]])
    panels[1].jointFromFrontSide = new Set([panels[2], panels[3]])
    panels[1].parallelFromFront = new Set([panels[0]])
    panels[2].jointFromFrontSide = new Set([panels[0], panels[1]])
    panels[2].parallelFromFront = new Set([panels[3]])
    panels[2].jointToFront = panels[1]
    panels[2].jointToBack = panels[0]
    panels[3].jointFromBackSide = new Set([panels[0], panels[1]])
    panels[3].parallelFromBack = new Set([panels[2]])
    panels[3].jointToFront = panels[1]
    panels[3].jointToBack = panels[0]
  }else{
    panels = [
      new PanelShape({ id: 0, wardrobe, name: "Крыша", length: width, vertical: false, position: { x: 0, y: wardrobe.height - 16 }, fixed_move: true, fixed_minlength: true, fixable: false, deletable: false, gabarit: true }),
      new PanelShape({ id: 1, wardrobe, name: "Крыша", length: width, vertical: false, position: { x: width, y: wardrobe.height - 16 }, fixed_move: true, fixed_minlength: true, fixable: false, deletable: false, gabarit: true }),
      new PanelShape({ id: 2, wardrobe, name: "Дно", length: width, vertical: false, position: { x: 0, y: leg }, fixed_move: true, fixed_minlength: true, fixable: false, deletable: false, gabarit: true }),
      new PanelShape({ id: 3, wardrobe, name: "Дно", length: width, vertical: false, position: { x: width, y: leg }, fixed_move: true, fixed_minlength: true, fixable: false, deletable: false, gabarit: true }),
      new PanelShape({ id: 4, wardrobe, name: "Стойка боковая", length: wardrobe.height - 32 - leg, vertical: true, position: { x: 0, y: 16 + leg }, fixed_move: true, fixed_minlength: true, fixable: false, deletable: false, gabarit: true  }),
      new PanelShape({ id: 5, wardrobe, name: "Стойка боковая", length: wardrobe.height - 32 - leg, vertical: true, position: { x: width * 2 - 16, y: 16 + leg }, fixed_move: true, fixed_minlength: true, fixable: false, deletable: false, gabarit: true }),
      new DoublePanelShape({ id: 6, wardrobe, name: "Стойка внутр", length: wardrobe.height - 32 - leg, vertical: true, position: { x: width - 16, y: 16 + leg }, fixed_move: true, fixed_minlength: true, fixable: true, deletable: false, gabarit: false }),
    ]
    panels[0].jointFromBackSide = new Set([panels[4], panels[6]])
    panels[0].parallelFromBack = new Set([panels[2]])
    panels[1].jointFromBackSide = new Set([panels[5], panels[6]])
    panels[1].parallelFromBack = new Set([panels[3]])
    panels[2].jointFromFrontSide = new Set([panels[4], panels[6]])
    panels[2].parallelFromFront = new Set([panels[0]])
    panels[3].jointFromFrontSide = new Set([panels[5], panels[6]])
    panels[3].parallelFromFront = new Set([panels[1]])

    panels[4].jointFromFrontSide = new Set([panels[0], panels[2]])
    panels[4].parallelFromFront = new Set([panels[6]])
    panels[5].jointFromBackSide = new Set([panels[1], panels[3]])
    panels[5].parallelFromBack = new Set([panels[6]])
    panels[4].jointToFront = panels[2]
    panels[4].jointToBack = panels[0]
    panels[5].jointToFront = panels[3]
    panels[5].jointToBack = panels[1]

    panels[6].jointFromBackSide = new Set([panels[0], panels[2]])
    panels[6].parallelFromBack = new Set([panels[4]])
    panels[6].jointFromFrontSide = new Set([panels[1], panels[3]])
    panels[6].parallelFromFront = new Set([panels[5]])
    panels[6].jointToFront = panels[2]
    panels[6].jointToBack = panels[0]
  }
  return { wardrobe, panels }
}

export function getInitialState(data) {
  const { wardrobe, panels } = createNewState(data)
  return {
    cursor: new SelectCursor({ x: 0, y: 0 }),
    curShape: null,
    prevStatus: Status.FREE,
    selectedPanels: new Set(),
    dimensions: new Set(),
    panels: new Set(panels),
    deleteConfirm: true,
    wardrobe,
    panelMargin: 0,
    toolButtonsPressed: {
      createVertical: false,
      createHorizontal: false,
      createSingleDimension: false,
      createTwoPanelDimension: false,
    },
    information: { order: "", plan: "", currentDate: getNewDate() },
    resetView: true,
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