import SelectCursor from "../components/shapes/cursors/SelectCursor";
import { captions } from '../locale/ru.js';
import { getNewDate, isMobile, Status } from "./functions";
import jwtDecode from "jwt-decode";
import { getViewPortState } from "../components/ViewPortContainer";
import { createFasades, createNewState } from "./createNewState";
import { getButtonPressed } from "./panelReducer";
import { SelectionSet } from "./panels";
import { getFasadBases } from "./materialReducer";

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
export const WORKSPACE = {
  CORPUS: "CORPUS",
  FASADES: "FASADES"
}

export function getInitialState(data) {
  const { wardrobe, panels } = createNewState(data)
  const fasades = createFasades({wardrobe})
  const fasadBaseColors = {}
  getFasadBases().forEach(b => fasadBaseColors[b] = [])
  return {
    workspace: WORKSPACE.CORPUS,
    cursor: new SelectCursor({ x: 0, y: 0 }),
    curShape: null,
    prevStatus: Status.FREE,
    selectedPanels: new SelectionSet(),
    dimensions: new Set(),
    fasades: new Set(fasades),
    fasadeDimensions: new Set(),
    panels: new Set(panels),
    deleteConfirm: true,
    getViewportData:false,
    wardrobe,
    //panelMargin: 0,
    toolButtonsPressed: getButtonPressed(),
    information: { order: "", plan: "", currentDate: getNewDate() },
    materials: {
      DSP: [{name: "венге магия"},{name: "дуб сонома"}, {name: "белый110"}],
      MIRROR: [''],
      fasadBases: getFasadBases(),
      activeDSPColor: wardrobe.dspCorpus
    },
    resetView: panels.length > 0,
    showLoading: false,
    showConfirm: { show: false, message: "" },
    showAlert: { show: false, message: "" },
    showDialog: { show: false },
    status: Status.FREE,
    statusBar: 5,
    statusParams: { creator: null, picker: null },
    viewPortData: getViewPortState(),
    isMobile: isMobile(),
    captions,
    user
  }
}