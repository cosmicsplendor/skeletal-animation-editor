import { useCallback, useReducer } from "react"
import * as importAxnTypes from "../constants/actionTypes/imports"
import { EDITOR_W } from "../constants"
import { v4 } from "uuid"

export default () => {
    const translatePointsToPixelsCoords = useCallback((point, spriteWidth, spriteHeight, editorWidth) => {
        if (!point) return point
        const translatedEditorWidth = Math.max(spriteWidth, spriteHeight)
        const spriteXOffset = spriteWidth < spriteHeight ? (spriteHeight - spriteWidth) * 0.5: 0
        const spriteYOffset = spriteHeight < spriteWidth ? (spriteWidth - spriteHeight) * 0.5: 0

        const normalizedX = point.x / editorWidth
        const normalizedY = point.y / editorWidth
        
        const translatedX = normalizedX * translatedEditorWidth - spriteXOffset
        const translatedY = normalizedY * translatedEditorWidth - spriteYOffset
        
        return ({
            x: translatedX,
            y: translatedY
        })
    }, [])
    const [ imports, setImports ] = useReducer((prevImports, action) => {
        const { type, payload } = action
        switch(type) {
            case importAxnTypes.add:
                const newImport = {
                    id: v4(),
                    ...payload,
                }
                return [ newImport, ...prevImports ]
            case importAxnTypes.dupe:
                const dupe = prevImports.find(imp => imp.id === payload.id)
                const basename = dupe.name
                const name = basename.split("_d1")[0]
                const maxDupeIdx = prevImports.reduce((max, imp) => {
                    const [ curName, curIdx ] = imp.name.split("_d1")
                    const idx = curName === name ? Number(curIdx || 0): 0
                    return Math.max(idx, max)
                }, 0)
                return [ { ...dupe, name: `${name}_d1${maxDupeIdx+1}`, id: v4() }, ...prevImports ]
            case importAxnTypes.update:
                const returnVal =  prevImports.map(imp => imp.id === payload.id ? { ...imp, ...payload }: imp)
                return returnVal
            case importAxnTypes.remove:
                return prevImports.filter(({ id }) => id !== payload.id)
            case importAxnTypes.clear:
                return []
            case importAxnTypes.updatePoints:
                return prevImports.map(imp => {
                    if (imp.id !== payload.id) return imp
                    const { startingPoint, endPoint } = payload
                    const payloadKeys = Object.keys(payload)

                    const startingPointInPx = translatePointsToPixelsCoords(startingPoint, imp.width, imp.height, EDITOR_W)
                    const endPointInPx = translatePointsToPixelsCoords(endPoint, imp.width, imp.height, EDITOR_W)

                    const newImp = { ...imp }
                    if (payloadKeys.includes("startingPoint")) {
                        Object.assign(newImp, { startingPoint, startingPointInPx })
                    }
                    if (payloadKeys.includes("endPoint")) {
                        Object.assign(newImp, { endPoint, endPointInPx })

                    }
                    return newImp
                })
        }
    }, [])

    const add = useCallback(item => {
        setImports({ type: importAxnTypes.add, payload: item })
    }, [])

    const duplicate = useCallback(payload => {
        setImports({ type: importAxnTypes.dupe, payload })
    }, [])
    
    const update = useCallback(payload => {
        setImports({ type: importAxnTypes.update, payload })
    }, [])
    
    const remove = useCallback(item => {
        setImports({ type: importAxnTypes.remove, payload: item })
    }, [])

    const clear = useCallback(() => {
        setImports({ type: importAxnTypes.clear })
    }, [])

    const updatePoints = useCallback(payload => {
        setImports({ type: importAxnTypes.updatePoints, payload })
    }, [])

    return {
        imports,
        importAxns: {
            add,
            update,
            remove,
            clear,
            updatePoints,
            duplicate
        }
    }
}