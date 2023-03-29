import DoublePanelShape from "../components/shapes/DoublePanelShape"
import FasadeShape from "../components/shapes/FasadeShape"
import PanelShape from "../components/shapes/PanelShape"

export function createNewState({ wardrobe }) {
    if (!wardrobe) return { wardrobe: {}, panels: [] }
    const width = wardrobe.double ? wardrobe.width / 2 : wardrobe.width
    const leg = 30
    let panels
    const state = {
        fixed_move: true,
        fixed_minlength: true,
        fixable: false,
        deletable: false,
        resizeable: false,
        drillable: false,
        gabarit: true
    }
    if (!wardrobe.double) {
        panels = [
            new PanelShape({ id: 0, wardrobe, name: "Крыша", length: width, vertical: false, position: { x: 0, y: wardrobe.height - 16 }, ...state }),
            new PanelShape({ id: 1, wardrobe, name: "Дно", length: width, vertical: false, position: { x: 0, y: leg }, ...state }),
            new PanelShape({ id: 2, wardrobe, name: "Стойка боковая", length: wardrobe.height - 32 - leg, vertical: true, position: { x: 0, y: 16 + leg }, ...state }),
            new PanelShape({ id: 3, wardrobe, name: "Стойка боковая", length: wardrobe.height - 32 - leg, vertical: true, position: { x: width - 16, y: 16 + leg }, ...state }),
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
    } else {
        wardrobe.width1 = width
        wardrobe.width2 = width
        panels = [
            new PanelShape({ id: 0, wardrobe, name: "Крыша", length: width, vertical: false, position: { x: 0, y: wardrobe.height - 16 }, ...state }),
            new PanelShape({ id: 1, wardrobe, name: "Крыша", length: width, vertical: false, position: { x: width, y: wardrobe.height - 16 }, ...state }),
            new PanelShape({ id: 2, wardrobe, name: "Дно", length: width, vertical: false, position: { x: 0, y: leg }, ...state }),
            new PanelShape({ id: 3, wardrobe, name: "Дно", length: width, vertical: false, position: { x: width, y: leg }, ...state }),
            new PanelShape({ id: 4, wardrobe, name: "Стойка боковая", length: wardrobe.height - 32 - leg, vertical: true, position: { x: 0, y: 16 + leg }, ...state }),
            new PanelShape({ id: 5, wardrobe, name: "Стойка боковая", length: wardrobe.height - 32 - leg, vertical: true, position: { x: width * 2 - 16, y: 16 + leg }, ...state }),
            new DoublePanelShape({ id: 6, wardrobe, name: "Стойка внутр", length: wardrobe.height - 32 - leg, vertical: true, position: { x: width - 16, y: 16 + leg }, ...state, fixable: true, gabarit: true }),
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

export function createFasades({ wardrobe }) {
    const width = getFasadeWidth(wardrobe.width, wardrobe.fasadeCount)
    const height = wardrobe.height - 157
    const fasades = []
    for(let i=0; i < wardrobe.fasadeCount; i++)
        fasades.push(new FasadeShape({height, width, base: wardrobe.fasadeBase, baseColor: wardrobe.fasadeBaseColor, position: {x: i * (width + 30), y: 0}, deletable: false }))
    return fasades
}

export function getFasadeWidth(wardrobeWidth, fasadeCount) {
    const offset = [88, 98, 108][fasadeCount - 2]
    return Math.round((wardrobeWidth - offset) / fasadeCount)
}