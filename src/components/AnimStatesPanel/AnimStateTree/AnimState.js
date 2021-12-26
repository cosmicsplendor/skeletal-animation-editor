import { useContext, useEffect, useRef } from "react"
import { CaretDownFilled  } from "@ant-design/icons"
import AppContext from "../../../AppContext"
import styles from "../style.css"

const AnimState = ({ name, id, marginLeft, collapsable, collapsed }) => {
    const { activeAnimState, setActiveAnimState, animStateAxns } = useContext(AppContext)
    const selectCurrentState = () => setActiveAnimState(id)
    const toggleCollapse = () => collapsable && animStateAxns.setCollapsed({ id, collapsed: !collapsed })
    const style = { width: `calc(90% - 8px - ${marginLeft}px)` }
    const caretRef = useRef()
    useEffect(() => {
        const rotation = collapsed ? "-180deg": 0
        caretRef.current.style.transform = `rotate(${rotation})`
    }, [ collapsed ])
    if (id === activeAnimState) Object.assign(style, { color: "whitesmoke", background: "#666"})
    return (
        <div className={styles.animStateItem}>
            {
                <CaretDownFilled className={styles.collapseToggle} onClick={toggleCollapse} ref={caretRef} style={{ color: collapsable ? "#444": "#999"}}/>
            }
            <div className={styles.animStateItemName} style={style} onClick={selectCurrentState} >
                {name}
            </div>
        </div>
    )
}

export default AnimState