import { useContext, useCallback } from "react"

import AppContext from "../../../AppContext"
import styles from "../style.css"

export default ({ src, id, name }) => {
    const { importAxns, activeSprite, setActiveSprite, animStateAxns } = useContext(AppContext)
    const removeImportedItem = useCallback((e) => {
        e.stopPropagation()
        setActiveSprite("")
        importAxns.remove({ id })
        animStateAxns.removeImport({ name })
    }, [])
    const imgStyle = activeSprite === id ? styles.activeImportedImg: styles.importedImg
    return (
        <div className={styles.importedItem} onClick={() => setActiveSprite(id)} title={name}>
            <img src={src} className={imgStyle}/>
            <div className={styles.rmImportBtn} onClick={removeImportedItem}>
                <span>&times;</span>
            </div>
        </div>
    )
}