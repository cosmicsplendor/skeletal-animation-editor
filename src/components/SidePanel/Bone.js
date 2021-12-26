import { useCallback, } from "react"
import { atan, len, dist } from "../../utils/math"

const stubWidth = 24
const stubHeight = 32

const Line = ({ start, end, lineStyle="solid", color, thickness=3, background="none" }) => {
    const dx = end.x - start.x
    const dy = end.y - start.y
    const length = len(dx, dy)
    const rotation = atan(dy, dx) * 180 / Math.PI
    const style = {
        position: "absolute",
        transformOrigin: `0 ${thickness * 0.5}px`,
        left: `${start.x}px`,
        top: `${start.y - thickness * 0.5}px`,
        transform: `rotate(${rotation}deg)`,
        width: `${length}px`,
        borderTop: `${thickness}px ${lineStyle} ${color}`,
        opacity: 1,
        background
    }
    return <div style={style} />
}

const BoneBody = ({ startingPoint, endPoint, color="#aaa" }) => {
    const angle = atan(endPoint.y - startingPoint.y, endPoint.x - startingPoint.x) * 180 / Math.PI
    const length = dist(startingPoint.x, startingPoint.y, endPoint.x, endPoint.y) + stubWidth
    const height = stubHeight
    const style = {
        width: 0,
        height: 0,
        position: "absolute",
        transformOrigin: `${stubWidth}px ${height * 0.5}px`,
        left: `${startingPoint.x - stubWidth}px`,
        top: `${startingPoint.y - height * 0.5}px`,
        transform: `rotate(${angle}deg)`,
        borderLeft: `${length}px solid ${color}`,
        borderTop: `${height/2}px solid transparent`,
        borderBottom: `${height/2}px solid transparent`
    }
    return <div style={style}/>
}

/**     P4
 *      |\`
 *      | \    `
 *      |  \        ` 
 *      |   \           `
 *      p3----  P1 -----------`P2
 *      |   /
 *      |  /
 *      | /
 *      |/
 *      P5
 */     
export default ({ startingPoint, endPoint }) => {
    const nonExistent = !startingPoint || !endPoint
    if (nonExistent) return null
    const p1 = startingPoint
    const p2 = endPoint
    const angle = atan(p2.y - p1.y, p2.x - p1.x)

    const p3 = {
        x: p1.x - stubWidth * Math.cos(angle),
        y: p1.y - stubWidth * Math.sin(angle)
    }

    const p4 = {
        x: p3.x + stubHeight * 0.5 * Math.cos(angle - Math.PI * 0.5),
        y: p3.y + stubHeight * 0.5 * Math.sin(angle - Math.PI * 0.5)
    }

    const p5 = {
        x: p3.x + stubHeight * 0.5 * Math.cos(angle + Math.PI * 0.5),
        y: p3.y + stubHeight * 0.5 * Math.sin(angle + Math.PI * 0.5)
    }

    const boneLines = [
        { start: p1, end: p2, color: "indianred", lineStyle: "dashed", background: "white" },
        { start: p4, end: p1, color: "indianred", lineStyle: "solid", background: "none" },
        { start: p5, end: p1, color: "indianred", lineStyle: "solid", background: "none" },
        { start: p4, end: p5, color: "brown", lineStyle: "solid" },
        { start: p4, end: p2, color: "brown", lineStyle: "solid" },
        { start: p5, end: p2, color: "brown", lineStyle: "solid" },
    ]

    return [ <BoneBody startingPoint={p1} endPoint={p2} color="rgba(256, 256, 256, 0.75)" key="bone-body"/> ].concat(boneLines.map((line, index) => {
        return <Line {...line} key={index}/>
    }))
}