import { useReducer, useCallback, useMemo } from "react"
import * as math from "../utils/math"
import { v4 } from "uuid"

const ROOT_STATE_NAME = "root state"

const axnTypes = Object.freeze({
    ADD: "ADD",
    REMOVE: "REMOVE",
    UPDATE: "UPDATE",
    ADD_IMPORT: "ADD_IMPORT",
    REMOVE_IMPORT: "REMOVE_IMPORT",
    CLEAR_IMPORTS: "CLEAR_IMPORTS",
    SET_COLLAPSED: "SET_COLLAPSED"
})

export const easingFns = Object.keys(math.easingFns)
export const getDefaultImportOpt = () => ({
    delAngularPos: 0,
    easingFn: easingFns[0],
    delay: 0,
    period: 1,
    angleMultiplier: 1
})

export default () => {
    const rootAnimState = useMemo(() => {
        return ({
            id: v4(),
            imports: { },
            parentId: null,
            name: ROOT_STATE_NAME
        })
    }, [])
    const [ animStates, setAnimStates ] = useReducer((prevAnimStates, action) => {
        const { type, payload } = action

        switch(type) {
            case axnTypes.ADD:
                const newState = { id: v4(), ...payload }
                return [ ...prevAnimStates, newState ]
            case axnTypes.REMOVE:
                const isValid = prevAnimStates.find(state => state.id === payload.id).name !== ROOT_STATE_NAME
                if (!isValid) return prevAnimStates

                const blacklist = []
                const populateBlacklist = parentStateId => {
                    blacklist.push(parentStateId)
                    const childStates = prevAnimStates.filter(state => state.parentId === parentStateId)
                    childStates.forEach(state => {
                        populateBlacklist(state.id)
                    })
                }
                populateBlacklist(payload.id)
                return prevAnimStates.filter(state => {
                    return !blacklist.includes(state.id)
                })
            case axnTypes.UPDATE:
                return prevAnimStates.map(state => {
                    if (state.id !== payload.id) return state
                    const { imports, ...rest } = state
                    return {
                        ...rest,
                        imports: {
                            ...imports,
                            [payload.importName]: {
                                ...imports[payload.importName],
                                ...payload
                            }
                        }
                    }
                })
            case axnTypes.SET_COLLAPSED:
                return prevAnimStates.map(state => {
                    if (state.id !== payload.id) return state
                    return {
                        ...state,
                        collapsed: payload.collapsed
                    }
                })
            case axnTypes.ADD_IMPORT:
                return prevAnimStates.map(state => {
                    const { imports, ...rest } = state
                    return {
                        imports: {
                            ...imports,
                            [payload.name]: { ...getDefaultImportOpt() }
                        },
                        ...rest
                    }
                })
            case axnTypes.REMOVE_IMPORT:
                return prevAnimStates.map(state => {
                    delete state.imports[payload.name]
                    const { imports, ...rest } = state
                    return {
                        imports: { ...imports },
                        ...rest
                    }
                })
            case axnTypes.CLEAR_IMPORTS:
                return prevAnimStates.map(state => {
                    const exports = ({
                        ...state,
                        imports: {}
                    })
                    return exports
                })
        }
    }, [ rootAnimState ])

    const add = useCallback(state => { // { parentId, imports: { [name]: { delay, dAngle, easingFn, period } }}
        setAnimStates({ type: axnTypes.ADD, payload: state })
    }, [])
    const remove = useCallback(payload => { // { id }
        setAnimStates({ type: axnTypes.REMOVE, payload: payload})
    }, [])
    const update = useCallback(payload => { // { id: animStateId, importName, ...updates }
        setAnimStates({ type: axnTypes.UPDATE, payload })
    }, [])
    const addImport = useCallback(item => { // { name }
        setAnimStates({ type: axnTypes.ADD_IMPORT, payload: item })
    }, [])
    const removeImport = useCallback(item => { // { name, ...import }
        setAnimStates({ type: axnTypes.REMOVE_IMPORT, payload: item })
    }, [])
    const clearImports = useCallback(() => { // null
        setAnimStates({ type: axnTypes.CLEAR_IMPORTS })
    }, [])
    const setCollapsed = useCallback(payload => { // { collapsed: Boolean }
        setAnimStates({ type: axnTypes.SET_COLLAPSED, payload })
    }, [])

    return {
        animStates,
        animStateAxns: {
            add,
            remove,
            update,
            removeImport,
            addImport,
            clearImports,
            setCollapsed
        }
    }
}