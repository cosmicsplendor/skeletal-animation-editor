class Node {
    constructor({ pos = { x: 0, y: 0}, rotation = 0, scale = { x: 1, y: 1 },  anchor = { x: 0, y: 0 }, pivot = { x: 0, y: 0 } } = {}) {
        this.children = []
        this.pos = pos
        this.scale = scale
        this.rotation = rotation
        this.anchor = anchor
        this.pivot = pivot
    }
    static updateRecursively(node, dt, t) {
        node.update && node.update(dt, t)
        if (!node.children) { return }
        const cachedChildren = node.children
        /**
         * cached copy of node.children must be kept to ensure the code executes predictably
         * in case we didn't do so, removal of a childNode (in it's update function) would break this recursion --
         * when the children iteration reaches the removed childNode's last sibling
         * that's because the new children array would have lastChildrenLength - 1 length, but the endpoint of the current iteration -- 
         * would still be lastChildrenLength. So trying access length index of the new children array would result in an undefined value
         * Here's an interesting fact: this shrinking of children array results in the removed node's next sibling shifting an index backward,
         * thus occupying the removed node's current position. The next iteration therefore skips over it.
         */
        for (let i = 0, len = cachedChildren.length; i < len; i++) {
            Node.updateRecursively(cachedChildren[i], dt, t)
        }
    }
    add(childNode) {
        this.children.push(childNode)
        childNode.parent = this
        return this
    }
    remove() {
        this.parent.children = this.parent.children.filter(n => n !== this)
    }
    removeChild(node) {
        this.children = this.children.filter(n => n !== node)
    }
}

export default Node