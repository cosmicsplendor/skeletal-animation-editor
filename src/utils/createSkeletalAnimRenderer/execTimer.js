import Node from "./entities/Node"
import Observable from "./Observable"

const rootNode = {
    val: null,
    get() {
        return this.val
    },
    set(val) {
        this.val = val
    }
}

class Timer extends Observable {
    constructor(duration, delay = 0) {
        super([ "done", "tick" ])
        this.invisible = true
        this.delay = delay
        this.duration = duration
        this.elapsed = 0
    }
    reset() {
        this.elapsed = 0
    }
    update(dt) {
        if (this.delay > 0) {
            this.delay -= dt
            return
        }
        this.elapsed += dt
        this.emit("tick", Math.min(this.elapsed / this.duration, 1)) // pass in progress as an argument
        if (this.elapsed > this.duration) {
            this.emit("done")
            this.remove()
            return
        }
    }
    remove() {
        this.parent.removeChild(this)
    }
}

export const registerRootNode = node => { // encapsulating root node value into rootNode object which is local to this closure so that the value is inaccessible (and doesn't spill out) to outside modules
    rootNode.set(node)
}

export default (duration, onTick=() => {}, delay) => {
    const newTimer = new Timer(duration, delay)
    rootNode.get().add(newTimer)
    newTimer.on("tick", onTick)
    return new Promise(resolve => {
        newTimer.on("done",  resolve)
    })
}