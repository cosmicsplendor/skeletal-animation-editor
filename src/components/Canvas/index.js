import { useContext, useEffect, useState, useRef, useMemo } from "react"
import { CaretRightOutlined } from "@ant-design/icons"

import AppContext from "../../AppContext"
import styles from "./style.css"
import createSkeletalAnimRenderer from "../../utils/createSkeletalAnimRenderer"
import { PREVIEW_ID } from "../../constants"


export default () => {
    const { imports, animStates, activeAnimState: activeAnimStateId, activeSprite, setData } = useContext(AppContext)
    const previewCanvasRef = useRef()
    const [ componentMounted, setComponentMounted ] = useState(false)

    const skeletalAnimRenderer = useMemo(() => {
        if (!componentMounted) return null
        return createSkeletalAnimRenderer(previewCanvasRef.current)
    }, [ componentMounted ])

    const activeAnimState = animStates.find(state => state.id === activeAnimStateId)
    const onPlay = () => {
        if (!componentMounted) return
        if (!activeSprite || !activeAnimState) return
        skeletalAnimRenderer.switchState(imports, activeAnimState, animStates, true)
    }
    useEffect(() => {
        const previewCanvas = previewCanvasRef.current
        const { width, height } = previewCanvas.getBoundingClientRect()
        previewCanvas.width = width
        previewCanvas.height = height

        setComponentMounted(true)
    }, [ ])

    useEffect(() => {
        if (!componentMounted) return
        if (!activeSprite || !activeAnimState) return skeletalAnimRenderer.clear()
        setData(JSON.stringify({
            bones: imports.map(im => {
                const { name, startingPointInPx, endPointInPx, parent, zIndex } = im
                return {
                    name,
                    startingPoint: startingPointInPx,
                    endPoint: endPointInPx,
                    parentName: parent,
                    zIndex
                }
            }),
            animStates: animStates
        }))
        skeletalAnimRenderer.switchState(imports, activeAnimState, animStates)
    }, [ imports, activeAnimState, componentMounted, activeSprite, animStates ])

    return (
       <div className={styles.previewContainer}>
            <canvas className={styles.previewCanvas} ref={previewCanvasRef} id={PREVIEW_ID} />
            <div className={styles.playBtn} title="play selected state" onClick={onPlay}> <CaretRightOutlined style={{ transform: "scale(1.8, 1)" }}/> </div>
       </div>
    )
}