import { useContext, useMemo } from "react"
import AppContext from "../../AppContext"
import styles from "./style.css"
import { v4 } from "uuid"

export default () => {
    const { activeAnimState: activeAnimStateId, setActiveAnimState: setActiveAnimStateId, animStates, animStateAxns } = useContext(AppContext)
    const activeAnimState = useMemo(() => {
        return animStates.find(state => state.id === activeAnimStateId)
    }, [ activeAnimStateId ])
    const addAnimState = () => {
        if (!activeAnimState) return
        const name = prompt("Enter Animation State Name")
        if (!name) return
        animStateAxns.add({
            parentId: activeAnimStateId,
            name: name,
            id: v4(),
            imports: { ...activeAnimState.imports }
        })
    }
    const removeAnimState = () => {
        // removal logic isn't as simple as this, all the children that call it children have to be removed this has to happen recursively
        // one more thing: gotta enhance the style 
        // and build this puny side panel
        // and maybe sync the canvas
        // that's about it
        // and oh the final touch make the meta downloadable
        // and integrate this good stuff with the library
        if (!activeAnimState) return
        animStateAxns.remove({
            id: activeAnimStateId
        })
    }
    return <div className={styles.controls}>
        <div onClick={addAnimState} className={styles.controlItem} title="add to selected state"> + </div>
        <div onClick={removeAnimState} className={styles.controlItem} title="remove selected state"> - </div>
    </div>
}