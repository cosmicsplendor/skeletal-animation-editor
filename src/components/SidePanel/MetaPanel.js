import { useContext, useMemo, useCallback, useRef, useState } from "react"
import { Space, notification, Typography, Input, Select, Button } from "antd"

import { clamp } from "../../utils/math"
import AppContext from ".././../AppContext"
import placeholderImg from "../../images/placeholder.png"
import styles from "./style.css"
import { EDITOR_W } from "../../constants"

import Bone from "./Bone"
import { CopyOutlined, DownloadOutlined } from "@ant-design/icons"

const hitboxEditorImgStyle = {
    width: EDITOR_W,
    height: EDITOR_W
}

const { Text } = Typography
const { Option } = Select

export default () => {
    const { activeSprite: activeSpriteID, imports, importAxns } = useContext(AppContext)
    const [editingBone, setEditingBone] = useState(false)
    const hbEditorRef = useRef()
    const computePoint = useMemo(() => {
        return (elementRef, event) => {
            const { x: originX, y: originY } = elementRef.current.getBoundingClientRect()
            const x = clamp(0, EDITOR_W, event.clientX - originX)
            const y = clamp(0, EDITOR_W, event.clientY - originY)
            return { x, y }
        }
    }, [])
    const activeSprite = useMemo(() => {
        return imports.find(({ id }) => activeSpriteID === id) || {}
    }, [activeSpriteID, imports])

    const evalParentItemsData = useCallback(() => {
        const itemsHash = imports.reduce((acc, cur) => {
            acc[cur.name] = cur
            return acc
        }, {})
        const isValidParent = name => {
            // traversing towards the root node
            let curParentName = name
            while (curParentName && curParentName !== "null") {
                if (curParentName === activeSprite.name) return false
                curParentName = itemsHash[curParentName].parent
            }

            return true
        }
        return Object.keys(itemsHash).filter(isValidParent)
    }, [activeSpriteID, imports])
    const inputsDisabled = !activeSpriteID
    const { src: spriteImg, zIndex, parent = "null", name, startingPoint, endPoint } = activeSprite
    const initiateBoneEditing = useCallback(function (e) {
        if (e.button !== 0) return
        e.preventDefault()
        if (editingBone === true || inputsDisabled) return
        const { x, y } = computePoint(hbEditorRef, e)

        importAxns.updatePoints({ id: activeSpriteID, startingPoint: { x, y }, endPoint: null })
        setEditingBone(true)
    }, [editingBone, inputsDisabled, activeSpriteID])
    const updateBone = useCallback(function (e) {
        if (e.button !== 0) return
        e.preventDefault()
        if (editingBone === false || inputsDisabled) return
        const { x, y } = computePoint(hbEditorRef, e)

        importAxns.updatePoints({ id: activeSpriteID, endPoint: { x, y } })
    }, [editingBone, inputsDisabled, activeSpriteID])
    const terminateBoneEditing = useCallback(function (e) {
        if (e.button !== 0) return
        e.preventDefault()
        if (editingBone === false || inputsDisabled) return
        const { x, y } = computePoint(hbEditorRef, e)
        const newEndpoint = startingPoint.x === x && startingPoint.y === y ? { x: x + 1, y: y + 1 } : { x, y }
        importAxns.updatePoints({ id: activeSpriteID, endPoint: newEndpoint })
        setEditingBone(false)
    }, [editingBone, inputsDisabled, activeSpriteID])
    const parentItemsData = evalParentItemsData()
    return (
        <div>
            <div className={styles.sectionHeader}>
                Bone Editor
            </div>
            <Space>
                <Space direction="vertical">
                    <div
                        className={styles.boneEditor}
                        onMouseDown={initiateBoneEditing}
                        onMouseUp={terminateBoneEditing}
                        onMouseMove={updateBone}
                        ref={hbEditorRef}
                    >
                        <img
                            className={styles.metaImage}
                            src={spriteImg || placeholderImg}
                            style={hitboxEditorImgStyle}
                        />
                        <Bone startingPoint={startingPoint} endPoint={endPoint} />
                    </div>
                </Space>
                <Space direction="vertical">

                    <Space direction="vertical">
                        <Text type="secondary">z-index</Text>
                        <Input
                            className={styles.input}
                            value={zIndex} placeholder="not selected"
                            type="number"
                            onChange={e => {
                                const newName = e.target.value
                                importAxns.update({ id: activeSpriteID, zIndex: newName })
                            }}
                            disabled={inputsDisabled}
                        />
                    </Space>
                    <Space direction="vertical">
                        <Text type="secondary">Parent Node</Text>
                        <Select
                            value={parent}
                            className={styles.select}
                            onChange={value => {
                                importAxns.update({ id: activeSpriteID, parent: value })
                            }}
                            size="large"
                            disabled={inputsDisabled}
                        >
                            {parentItemsData.map((name, i) => <Option key={i} value={name}>{name}</Option>)}
                        </Select>
                    </Space>
                </Space>
            </Space>
            <div>
                {
                    name && <Button className={styles.downloadBtn} onClick={() => {
                        importAxns.duplicate({ id: activeSpriteID })
                    }} icon={<CopyOutlined />}>
                        <span>Clone</span> <strong> {name}</strong>
                    </Button>
                }
            </div>
        </div>
    )
}