import Panel from "../UIPrimitives/Panel"
import AnimStateTree from "./AnimStateTree"
import Controls from "./Controls"
import styles from "./style.css"

export default () => {
    return (
        <Panel className={styles.animStatesPanel}>
            <div className={styles.sectionHeader}>Anim States</div>
            <AnimStateTree />
            <Controls />
        </Panel>
    )
}