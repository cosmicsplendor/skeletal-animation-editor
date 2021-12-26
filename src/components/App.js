import { PageHeader, Tag } from "antd"

import Canvas from "./Canvas"
import AnimStatesPanel from "./AnimStatesPanel"
import SidePanel from "./SidePanel"
import ImportPanel from "./ImportPanel"
import ClearBtn from "./ClearBtn"
import styles from "./style.css"

const  App = () => {
    return (
        <div id="app">
            <PageHeader
                ghost={false}
                backIcon=""
                onBack={() => {}}
                title="Forward Kinematics Skeletal Anim Editor"
                // subTitle="made with"
                // tags={<Tag color="blue">React.js</Tag>}
                extra={
                    <ClearBtn />
                }
                className={styles.appbar}
            />
            <ImportPanel />
            <div className={styles.upperSection}>
                <SidePanel />
                <Canvas />
                <AnimStatesPanel /> 
            </div>
        </div>
    )
}

export default App