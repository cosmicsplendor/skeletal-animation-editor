import { useMemo, useContext } from "react"
import styles from "../style.css"
import AppContext from "../../../AppContext"
import AnimState from "./AnimState"
const MARGIN_LEFT = 48

export default () => {
    const { animStates } = useContext(AppContext)
    const rootNode = useMemo(() => {
        const nodes = animStates.map(state => ({
            name: state.name,
            parentId: state.parentId,
            id: state.id,
            children: [],
            collapsed: Boolean(state.collapsed)
        }))
        const rootNode = nodes.find(node => !node.parentId)
        nodes.forEach(node => {
            if (node.id === rootNode.id) return
            const parentNode = nodes.find(({ id }) => id === node.parentId)
            parentNode.children.push(node)
        })
        const enumerateChildrenLength = node => {
            node.childrenLength = node.children.length
            node.collapsable = Boolean(node.childrenLength)
            node.children.forEach(childNode => enumerateChildrenLength(childNode))
        }
        const syncCollapse = node => {
            if (node.collapsed) {
                node.children.length = 0
            }
            node.children.forEach(childNode => syncCollapse(childNode))
        }
        enumerateChildrenLength(rootNode)
        syncCollapse(rootNode)
        return rootNode
    }, [ animStates ])

    const nodeList = useMemo(() => {
        const list = []
        const populateList = (node, marginLeft=0) => {
            node.marginLeft = marginLeft * MARGIN_LEFT
            list.push(node)
            node.children.forEach(childNode => {
                populateList(childNode, marginLeft + 1)
            })
        }
        populateList(rootNode)
        return list
    }, [ rootNode ])

    return (
        <div className={styles.animStatesContainer}>
            {
                nodeList.map((node, index) => {
                    return <AnimState key={index} {...node}/>
                })
            }
        </div>
    )
}