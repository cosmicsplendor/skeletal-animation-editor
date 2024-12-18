import Node from "./entities/Node"
import Canvas2DRenderer from "./renderer/Canvas2D"
import { len, atan, easingFns } from "../math"
import execTimer, { registerRootNode as registerRootNodeToTimer } from "./execTimer"
import startGameLoop from "./startGameLoop.js"
import Texture from "./entities/core/Texture"

export default canvas => {
    const sceneGraph = new Node()
    const renderer = new Canvas2DRenderer({ canvas, scene: sceneGraph })
    const calcAbsAngle = (spriteName, animState, animStates) => {
        const parentState = animStates.find(state => {
            return animState.parentId === state.id
        })
        const { delAngularPos, angleMultiplier } = animState.imports[spriteName]
        const curAngle = delAngularPos * angleMultiplier
        if (!parentState) return curAngle
        return curAngle + calcAbsAngle(spriteName, parentState, animStates)
    }
    const mapSpritesToTextures = (function() {
        const mapper = (sprite, animState, animStates) => {
            const { src, name, startingPointInPx = { x: 0, y: 0 }, endPointInPx = { x: 0, y: 0 }, parent: parentBoneName, zIndex } = sprite
            const tex = new Texture({ imgUrl: src })
            const prevAnimState = animStates.find(state => {
                return animState.parentId === state.id
            })
            const { easingFn, delay, period } = animState.imports[sprite.name]
            const boneVecX = endPointInPx ? endPointInPx.x - startingPointInPx.x: 0
            const boneVecY = endPointInPx ? endPointInPx.y - startingPointInPx.y: 0
            tex.name = name
            tex.width = tex.img.width
            tex.height = tex.img.height
            tex.anchor = { ...startingPointInPx }
            tex.length = len(boneVecX, boneVecY)
            tex.angle = atan(boneVecY, boneVecX)
            tex.parentBoneName = parentBoneName
            tex.childBones = []
            tex.zIndex = zIndex
            tex.angularPos = calcAbsAngle(sprite.name, animState, animStates)
            tex.prevAngularPos = !!prevAnimState ? calcAbsAngle(sprite.name, prevAnimState, animStates): 0
            tex.period = period
            tex.delay = delay
            tex.easingFn = easingFn
            return tex
        }
        return (sprites, animState, animStates) => sprites.map(sprite => mapper(sprite, animState, animStates))
    })();
    const buildSkeletalSceneGraph = textures => {
        const texHash = textures.reduce((hash, tex) => {
            hash[tex.name] = tex
            return hash
        }, {})
        textures.forEach(tex => {
            if (!tex.parentBoneName) return
            if (texHash[tex.parentBoneName]) {
                texHash[tex.parentBoneName].childBones.push(tex)
            }
        })

        const returnVal = textures.find(tex => tex.childBones.length && !tex.parentBoneName)
        return returnVal
    }
    const addRecursively = bone => {
        sceneGraph.add(bone)
        bone.childBones.forEach(childBone => {
            addRecursively(childBone)
        })
    }
    const syncRecursively = (bone, globalAnchorPos, globalAngularPos) => {
        const { angularPos, anchor } = bone
        bone.pos.x = globalAnchorPos.x - anchor.x
        bone.pos.y = globalAnchorPos.y - anchor.y
        bone.rotation = angularPos + globalAngularPos

        const netAngle = bone.angle + bone.rotation * (Math.PI / 180)
        const newGlobalPos = {...globalAnchorPos}
        newGlobalPos.x += bone.length * Math.cos(netAngle)
        newGlobalPos.y += bone.length * Math.sin(netAngle)
        bone.childBones.forEach((childBone, i) => {
            syncRecursively(childBone, newGlobalPos, bone.rotation)
        })
    }
    registerRootNodeToTimer(sceneGraph)
    startGameLoop({ renderer })
    return Object.freeze({
        skeletalSceneGraph: null,
        switchState(sprites, animState, animStates, transition=false) {
            sceneGraph.children = []
            const textures = mapSpritesToTextures(sprites, animState, animStates)
            const skeletalSceneGraph = buildSkeletalSceneGraph(textures)
            const synchroNode = new Node()
            const globalAnchorPos = { x: 200, y: 200 }
            const globalAngularPos = 0
            const syncBones = () => {
                syncRecursively(skeletalSceneGraph, { ...globalAnchorPos }, globalAngularPos)
            }
            if (!skeletalSceneGraph) return
            // addRecursively(skeletalSceneGraph)
            textures.reverse().sort((a, b) => {
                const aZIndex = a.zIndex || 0
                const bZIndex = b.zIndex || 0
                return aZIndex - bZIndex
            }).forEach((texture, i) => {
                sceneGraph.add(texture)
            })
            syncBones()
            
            if (!transition) return

            textures.forEach(texture => {
                const { angularPos, prevAngularPos, period, delay, easingFn } = texture
                const delAngularPos = angularPos - prevAngularPos
                const baseAngularPos = prevAngularPos
                texture.angularPos = baseAngularPos
                execTimer(period, t => {
                    texture.angularPos = baseAngularPos + delAngularPos * easingFns[easingFn](t)
                }, delay)
            })
            syncBones()
            sceneGraph.add(synchroNode)
            synchroNode.update = () => {
                syncBones()
            }
        },
        clear() {
            sceneGraph.children = []
        }
    })
}
