import { Rectangle } from "../utils/geometry";

export function getPoint(e) {
  let rect = e.target.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

export function scale(factor, anchor, viewPortData) {
  const { realWidth, viewPortWidth, viewPortHeight, topLeft } = viewPortData;
  const rw = realWidth * factor;
  var gridStep = viewPortData.gridStep;
  const pixelRatio = rw / viewPortWidth;
  const realHeight = viewPortHeight * pixelRatio;
  var dx = anchor.x - topLeft.x;
  var dy = anchor.y - topLeft.y;
  if (realHeight < 500) return { ...viewPortData };
  dx = dx * factor;
  dy = dy * factor;
  //new topLeft
  const tl = { x: anchor.x - dx, y: anchor.y - dy };
  const br = {};
  br.x = tl.x + rw;
  br.y = tl.y - realHeight;
  //new gridStep
  if (gridStep / pixelRatio < 10) {
    if (gridStep < 1000000) gridStep = gridStep * 10;
  } else if (gridStep / pixelRatio > 100)
    if (gridStep > 0.001) gridStep = gridStep / 10;
  const gridStepPixels = Math.round(gridStep / pixelRatio);
  return {
    ...viewPortData,
    realWidth: rw,
    realHeight,
    topLeft: tl,
    bottomRight: br,
    pixelRatio,
    gridStepPixels,
    gridStep,
  };
}

export function setCurCoord(realPoint, screenPoint, viewPortData) {
  return {
    ...viewPortData,
    curRealPoint: realPoint,
    curScreenPoint: screenPoint,
  };
}

export function setTopLeft(topLeft, viewPortData) {
  var bottomRight = {};
  bottomRight.x = topLeft.x + viewPortData.realWidth;
  bottomRight.y = topLeft.y - viewPortData.realHeight;
  return { ...viewPortData, topLeft, bottomRight };
}
export function getRealRect(topLeft, bottomRight) {
  let realRect = new Rectangle();
  realRect.topLeft = topLeft;
  realRect.bottomRight = bottomRight;
  realRect.width = bottomRight.x - topLeft.x;
  realRect.height = topLeft.y - bottomRight.y;
  return realRect;
}

export function getScreenRect(viewPortWidth, viewPortHeight) {
  let screenRect = new Rectangle();
  screenRect.topLeft.x = 0;
  screenRect.topLeft.y = 0;
  screenRect.width = viewPortWidth;
  screenRect.height = viewPortHeight;
  return screenRect;
}

export function setDimensions(width, height, realWidth, viewPortData) {
  const rh = (height * realWidth) / width;
  return {
    ...viewPortData,
    viewPortWidth: width,
    viewPortHeight: height,
    realWidth: realWidth,
    ratio: width / height,
    pixelRatio: realWidth / viewPortData.viewPortWidth,
    realHeight: rh,
    bottomRight: {
      x: viewPortData.topLeft.x + realWidth,
      y: viewPortData.topLeft.y - rh,
    },
  };
}

export function zoomToRect(rect, viewPortData) {
  const newViewPortData = setDimensions(viewPortData.viewPortWidth, viewPortData.viewPortHeight, 6500, viewPortData);
  const point = {
    x: (rect.topLeft.x + rect.bottomRight.x) / 2,
    y: (rect.topLeft.y + rect.bottomRight.y) / 2,
  };
  let viewPortWidth = newViewPortData.realWidth - (newViewPortData.marginLeft + newViewPortData.marginRight) * newViewPortData.pixelRatio;
  let viewPortHeight = newViewPortData.realHeight - (newViewPortData.marginTop + newViewPortData.marginBottom) * newViewPortData.pixelRatio;
  const tl = {
    x: point.x - viewPortWidth / 2 - newViewPortData.marginLeft * newViewPortData.pixelRatio,
    y: point.y + viewPortHeight / 2 + newViewPortData.marginTop * newViewPortData.pixelRatio,
  };
  const br = {};
  br.x = tl.x + newViewPortData.realWidth;
  br.y = tl.y - newViewPortData.realHeight;
  return { ...newViewPortData, topLeft: tl, bottomRight: br };
}

export function addWindowListeners(viewPortData, setViewPortData, appActions, canvas) {
  document.getElementById("spinner").style.display = "none";
  const { sw, sh } = resize(viewPortData, setViewPortData, canvas);
  setViewPortData((prevData) => setDimensions(sw, sh, 10000, prevData));
  //setViewPortData((prevData) => scale(2, { x: 0, y: 0 }, prevData));
  

  document.body.oncontextmenu = () => true;
  document.addEventListener("load", () => {
  ///zoomToTable({topLeft:{x: 0, y: 2400}, bottomRight: {x: 3000, y: 0}}, viewPortData)
  });
  window.addEventListener("resize", () => {
    resize(viewPortData, setViewPortData, canvas);
  });
  window.addEventListener("scroll", () => {
    if (window.scrollY >= 10) {
      document.getElementById("goTop").style.display = "block";
      const listener = document
        .getElementById("goTop")
        .addEventListener("click", (e) => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          e.target.removeEventListener("click", listener);
        });
    }
    if (window.scrollY < 10) {
      document.getElementById("goTop").style.display = "none";
    }
  });
}

function resize(viewPortData, setViewPortData, canvas) {
  const wHeight = window.innerHeight;
  const cont = document.getElementById("canvas-container")
  const style = getComputedStyle(cont)
  const sw = Number.parseInt(style.width);
  let sh =
    window.innerHeight <= window.innerWidth
      ? wHeight * 0.8
      : sw
  setViewPortData((prevData) =>
    setDimensions(sw, sh, prevData.realWidth, prevData)
  );
  canvas.width = sw;
  canvas.height = sh;
  canvas.style.width = sw + "px";
  canvas.style.height = sh + "px";
  return { sw, sh };
}
