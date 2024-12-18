import { useContext, useMemo, useCallback } from "react"
import { Select, Input, Typography, Space, Slider } from "antd"

import { easingFns } from "../../../utils/math"
import AppContext from "../../../AppContext"
import styles from "../style.css"

const { Text } = Typography
const { Option } = Select

const easingFnOpts = Object.keys(easingFns)
export default () => {
    const { imports, animStates, activeAnimState: activeAnimStateId, activeSprite: activeSpriteId, animStateAxns } = useContext(AppContext)
    const activeSprite = useMemo(() => {
        return imports.find(({ id }) => id === activeSpriteId)
    }, [ activeSpriteId ])
    const activeAnimState = useMemo(() => {
        return animStates.find(({ id }) => id === activeAnimStateId)
    })
    const updateOpts = useCallback(opts => {
        animStateAxns.update({
            id: activeAnimStateId,
            importName: activeSprite.name,
            ...opts
        })
    }, [ activeSpriteId, activeAnimStateId ])
    const inputsDisabled = !activeAnimState || !activeSprite
    const easingFn = inputsDisabled ? easingFns.smoothStep: activeAnimState.imports[activeSprite.name].easingFn
    const period = inputsDisabled ? 1: activeAnimState.imports[activeSprite.name].period
    const delay = inputsDisabled ? 0: activeAnimState.imports[activeSprite.name].delay
    const delAngularPos = inputsDisabled ? 0: activeAnimState.imports[activeSprite.name].delAngularPos
    const angleMultiplier = inputsDisabled ? 1: activeAnimState.imports[activeSprite.name].angleMultiplier
    const absoluteAngle = useMemo(() => {
        if (!activeAnimState || inputsDisabled) return null
        const calcNetAngle = (sprite, state) => {
            const parentState = animStates.find(({ id }) => id === state.parentId )
            const { delAngularPos, angleMultiplier } = state.imports[sprite.name]
            const curAngle = delAngularPos * angleMultiplier
            if (!parentState) return curAngle
            return curAngle + calcNetAngle(sprite, parentState)
        }
        const calcAbsAngle = (sprite, state) => {
            const parentSprite = imports.find(imp => imp.name === sprite.parent)
            if (!parentSprite) return calcNetAngle(sprite, state)
            return calcNetAngle(sprite, state) + calcAbsAngle(parentSprite, state)
        }
        return calcAbsAngle(activeSprite, activeAnimState)
    }, [ activeSprite, activeAnimState, inputsDisabled ])
    return (
        <div>
            <h3>
                Sprite Anim State 
            </h3>
           <Space direction="vertical">
                <div>
                    <Space direction="vertical">
                        <Text type="secondary">easing function</Text>
                        <Select value={easingFn} className={styles.select} onChange={value => updateOpts({ easingFn: value })} size="large" disabled={inputsDisabled}>
                            {easingFnOpts.map((name, i) => <Option key={i} value={name}>{name}</Option>)}
                        </Select>
                    </Space>
                </div>
                <div>
                    <Space direction="vertical">
                        <Text type="secondary">anim period and delay</Text>
                        <Space>
                            <Input className={styles.input} type="number" step="0.1" addonBefore="period" value={period} addonAfter="s" onChange={e => updateOpts({ period: Number.parseFloat(e.target.value || 0) })} disabled={inputsDisabled}/>
                            <Input className={styles.input} type="number" step="0.1" addonBefore="delay" value={delay} addonAfter="s" onChange={e => updateOpts({ delay: Number.parseFloat(e.target.value || 0)})} disabled={inputsDisabled}/>
                        </Space>
                    </Space>
                </div>
                <div>
                    <Space direction="vertical">
                        <Text type="secondary">del angular pos</Text>
                        <Space style={{ alignItems: "center" }}>
                            <Slider 
                                range={false} 
                                value={delAngularPos}
                                onChange={value => updateOpts({ delAngularPos: value })}
                                disabled={inputsDisabled}
                                min={0}
                                max={360}
                                tipFormatter={val => `${val} degree`}
                                className={styles.slider}
                            />
                        </Space>
                    </Space>
                </div>
                <div>
                    <Space direction="vertical">
                        <Text type="secondary"> angle multiplier </Text>
                        <Input type="number" className={styles.input} value={angleMultiplier} onChange={e => updateOpts({ angleMultiplier: e.target.value })} disabled={inputsDisabled}/>
                    </Space>
                </div>
                <div>
                    <Space direction="horizontal">
                        <Text type="secondary">absolute angle: </Text>
                        <Text type="primary">{absoluteAngle !== 0 && !absoluteAngle ? "null": `${absoluteAngle} deg`}</Text>
                    </Space>
                </div>
           </Space>
        </div>
    )
}