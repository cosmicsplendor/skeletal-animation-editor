import { useContext, useCallback } from "react"
import { Button } from "antd"
import { DownloadOutlined } from "@ant-design/icons"
import AppContext from "../AppContext"
import styles from "./style.css"
import * as download from "../utils/download"
export default () => {
    const { data } = useContext(AppContext)
    const downloadData = useCallback(() => {
        download.text({
            name: "anim-data",
            format: "cson",
            body: data
        })
    }, [ data ])
    return <Button className={styles.downloadBtn} onClick={downloadData} icon={<DownloadOutlined />}> Data </Button>
}