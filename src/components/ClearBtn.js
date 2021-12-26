import { useContext, useCallback } from "react"
import { Button } from "antd"

import AppContext from "../AppContext"

const ClearApp = () => {
    const { importAxns, animStateAxns, setActiveSprite } = useContext(AppContext)
    const clickHandler = useCallback(() => {
        setActiveSprite(null)
        importAxns.clear()
        animStateAxns.clearImports()
    }, [])
    return (
        <Button onClick={clickHandler} type="secondary"> Clear </Button>
    )
}

export default ClearApp