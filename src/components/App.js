import { PageHeader, Tag } from "antd"

import Canvas from "./Canvas"
import RightSidePanel from "./RightSidePanel"
import SidePanel from "./SidePanel"
import ImportPanel from "./ImportPanel"
import ClearBtn from "./ClearBtn"
import DownloadBtn from "./DownloadBtn"
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
                    <>
                        <DownloadBtn />
                        <ClearBtn />
                    </>
                }
                className={styles.appbar}
            />
            <ImportPanel />
            <div className={styles.upperSection}>
                <SidePanel />
                <Canvas />
                <RightSidePanel /> 
            </div>
        </div>
    )
}

export default App