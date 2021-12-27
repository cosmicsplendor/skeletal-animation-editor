import { TexRegion } from "@lib"
import { len, atan } from "@utils/math"
import execTimer from "@utils/execTimer"

const mapBoneToTexRegion = bone => {
    const { name, startingPointInPx = { x: 0, y: 0 }, endPointInPx = { x: 0, y: 0 }, parent: parentBoneName, zIndex } = bone
    const texRegion = new TexRegion({ frame: "name" })
   
    const boneVecX = endPointInPx ? endPointInPx.x - startingPointInPx.x: 0
    const boneVecY = endPointInPx ? endPointInPx.y - startingPointInPx.y: 0

    texRegion.name = name
    texRegion.anchor = { ...startingPointInPx }
    texRegion.length = len(boneVecX, boneVecY)
    texRegion.angle = atan(boneVecY, boneVecX)
    texRegion.parentBoneName = parentBoneName
    texRegion.childBones = []
    texRegion.zIndex = zIndex

    return texRegion
}

const buildSkeletalSceneGraph = bones => {
    bones.forEach(bone => {
        if (!bone.parentBoneName) return
        const parentBone = bones.find(({ name }) => {
            return name === bone.parentBoneName
        })
        parentBone.childBones.push(bone)
    })

    return bones.find(bone => bone.childBones.length && !bone.parent)
}

const calcAbsAngle = (boneName, animState, animStates) => {
    const parentState = animStates.find(state => {
        return animState.parentId === state.id
    })
    const { delAngularPos, angleMultiplier } = animState.imports[boneName]
    const curAngle = delAngularPos * angleMultiplier
    if (!parentState) return curAngle
    return curAngle + calcAbsAngle(boneName, parentState, animStates)
}

class BoneAnimation extends Node {
    _playing = false
    constructor({ data, ...rest }) {
        super({ ...rest })
        const { bones: boneData, animStates } = JSON.parse(data)
        this.states = animStates
        this.bones = boneData.map(mapBoneToTexRegion)
        this.rootBone = buildSkeletalSceneGraph(this.bones)

        this.sortAndAddBones(this.bones)
    }
    sortAndAddBones(bones) {
        bones.sort((a, b) => {
            const aZIndex = a.zIndex || 0
            const bZIndex = b.zIndex || 0
            return aZIndex - bZIndex
        }).forEach(bone => {
            this.add(bone)
        })
    }
    syncRecursively(bone=this.rootNode, globalAnchorPos={...this.pos}, globalAngularPos=0) {
        const { angularPos, anchor } = bone
        bone.pos.x = globalAnchorPos.x - anchor.x
        bone.pos.y = globalAnchorPos.y - anchor.y
        bone.rotation = angularPos + globalAngularPos

        const netAngle = bone.angle + bone.rotation * (Math.PI / 180)

        globalAnchorPos.x += bone.length * Math.cos(netAngle)
        globalAnchorPos.y += bone.length * Math.sin(netAngle)
        
        bone.childBones.forEach(childBone => {
            syncRecursively(childBone, globalAnchorPos, bone.rotation)
        })
    }
    play(stateName, transition=true, reverse=false) {
        if (this._playing || !this.rootBone) return
        const { states } = this
        const curState = states.find(state => state.name === stateName)
        const prevState = states.find(state => state.id === curState.parentId) || curState
        let maxDuration = 0
        this.bones.forEach(bone => {
            const angularPos = calcAbsAngle(bone.name, curState, states)
            const prevAngularPos = calcAbsAngle(bone.name, prevState, states)
            const { easingFn, delay, period } = curState.imports[bone.name]

            const delAngularPos = angularPos - prevAngularPos
            const baseAngularPos = prevAngularPos

            const duration = delAngularPos === 0 ? 0: period + delay

            maxDuration = Math.max(duration, maxDuration)
            bone.angularPos = baseAngularPos
            execTimer(period, t => {
                bone.angularPos = baseAngularPos + delAngularPos * easingFns[easingFn](t)
            }, delay)
        })
        this._playing = true
        return execTimer(maxDuration, () => {
            this.syncRecursively()
        }).then(() => {
            this._playing = false
        })
    }   
}

export default BoneAnimation