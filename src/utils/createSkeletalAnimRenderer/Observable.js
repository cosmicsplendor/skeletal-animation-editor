class Observable {
    constructor(events = [], props = {}) {
        this.events = events.reduce((events, event) => {
            events[event] = []
            return events
        }, {})
        Object.assign(this, props)
    }
    on(event, callback) {
        if (!this.events[event]) {
            throw new Error(`attempting to listen to an unknown event: "${event}"`)
        }
        this.events[event].push(callback)
    }
    once(event, callback) {
        callback.once = true
        this.on(event, callback)
    }
    off(event, callback) {
        if (!callback) {
            return this.events[event] = []
        }
        this.events[event] = this.events[event].filter(cb => cb !== callback)
    }
    emit(event, ...params) {
        const subscribers = [...this.events[event]]
        subscribers.forEach(callback => {
            callback(...params)
            if (callback.once) {
                this.off(event, callback)
            }
        })
    }
}

export default Observable