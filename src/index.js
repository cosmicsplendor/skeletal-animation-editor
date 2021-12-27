import { useState } from "react"
import reactDOM from "react-dom"

import App from "./components/App"
import AppContext from "./AppContext"
import useImport from "./hooks/useImports"
import useAnimStates from "./hooks/useAnimStates"

const AppContainer = () => {
    const [ activeSprite, setActiveSprite ] = useState("")
    const [ activeAnimState, setActiveAnimState ] = useState("")
    const [ data, setData ] = useState("")
    const { imports, importAxns } = useImport()
    const { animStates, animStateAxns } = useAnimStates()
    return (
        <AppContext.Provider value={{ imports, importAxns, activeSprite, setActiveSprite, animStates, animStateAxns, activeAnimState, setActiveAnimState, data, setData }} >
            <App />
        </AppContext.Provider>
    )
}

reactDOM.render(<AppContainer />, document.querySelector("#app-container"))
