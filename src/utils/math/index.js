export const rand = (to, from = 0) => from + Math.floor((to - from + 1)* Math.random())

export const randf = (to, from = 0) => from + (to - from) * Math.random()

export const skewedRand = (to, from = 0) => from + Math.floor((to - from + 1) * Math.random() * Math.random())

export const pickOne = array => array[rand(array.length - 1)]

export const clamp = (from = 0, to = 1, num) => Math.min(to, Math.max(from, num))

export const sign = num => num === 0 ? 1 : num / Math.abs(num)

export const lerp = (from, to, num) => (num - from) / (to - from)

export const stripFloat = (num, place) => Math.floor(num * place) / place

export const roundFloat = (num, place) => Math.round(num * place) / place


export const len = (x, y) => Math.sqrt(x * x + y * y)

export const dist = (x0, y0, x1, y1) => len(x1 - x0, y1 - y0)

export const sqLen = (x, y) => x * x + y * y

export const calcNormal = (x, y) => {
    const length = len(x, y)
    return { x: y / length, y: -x / length}
}

export const normalize = (x, y) => {
    const magnitude = len(x, y)
    return { x: x / magnitude, y: y / magnitude }
}

export const easingFns = {
    linear(x) {
        return x
    },
    quadIn(x) {
        return  x * x
    },
    quadOut(x) {
        return 1 - this.quadIn(x - 1)
    },
    cubicIn(x) {
        return x * x * x
    },
    cubicOut(x) {
        return 1 - this.cubicIn(1 - x)
    },
    smoothStep(x) {
        return x * x * (3 - 2 * x)
    },
    sin(x) {
        return Math.sin(Math.PI * 0.5 * x)
    }
}

export const fixedAabb = (b1, b2) => {
    if (
        stripFloat(b1.x + b1.width, 10000) <= stripFloat(b2.x, 10000) || 
        stripFloat(b1.x, 10000) >= stripFloat(b2.x + b2.width, 10000) ||
        stripFloat(b1.y + b1.height, 10000) <= stripFloat(b2.y, 10000) ||
        stripFloat(b1.y, 10000) >= stripFloat(b2.y + b2.height, 10000)
    ) {
            return false
    }
    return true
}

export const aabb = (b1, b2) => {
    if (
        b1.x + b1.width <= b2.x || 
        b1.x >= b2.x + b2.width ||
        b1.y + b1.height <= b2.y ||
        b1.y >= b2.y + b2.height
    ) {
            return false
    }
    return true
}

export const circCirc = (b1, b2) => {
    const radiiSum = b1.radius + b2.radius
    const xDist = (b1.x + b1.radius / 2) - (b2.x + b2.radius / 2)
    const yDist = (b1.y + b1.radius / 2) - (b2.y + b2.radius / 2)
    const sqDist = xDist * xDist + yDist * yDist
    return sqDist <= radiiSum * radiiSum
}

export const aabbCirc = (rectBounds, circBounds) => {
    const closestDistX = circBounds.x + circBounds.radius - clamp(rectBounds.x, rectBounds.x + rectBounds.width, circBounds.x + circBounds.radius)
    const closestDistY = circBounds.y + circBounds.radius - clamp(rectBounds.y, rectBounds.y + rectBounds.height, circBounds.y + circBounds.radius)

    
    const sqClosestDist = closestDistX * closestDistX + closestDistY * closestDistY
    return Math.round(sqClosestDist) < circBounds.radius * circBounds.radius
}

export const circPlank = (circBounds, plankBounds) => {
    if (!aabbCirc(plankBounds, circBounds)) {
        return
    }
    const vecBEX = (circBounds.x + circBounds.radius) - plankBounds.x
    const vecBEY = (circBounds.y + circBounds.radius) - plankBounds.y
    const normalDist = plankBounds.normalX * vecBEX + plankBounds.normalY * vecBEY // 1D vector
    return normalDist < circBounds.radius
}

export const contains = ({ box, point }) => {
    const xcond = point.x > box.x && point.x < box.x + box.width
    const ycond = point.y > box.y && point.y < box.y + box.height
    return xcond && ycond
}

export const atan = (y, x) => {
    const abs = Math.abs(Math.atan(y / x))
    if (x === 0) {
        return abs * sign(y)
    }
    if (x > 0 && y < 0) { // fourth quadrant
        return -abs
    }
    if (x < 0 && y < 0) { // third quadrant
        return Math.PI + abs
    }
    if (x < 0 && y > 0) { // second quadrant
        return Math.PI - abs
    }
    if (x > 0 && y > 0) { // first quadrant
        return abs
    }
    if (y === 0 && x > 0) {
        return 0
    }
    if (y === 0 && x < 0) {
        return Math.PI
    }
    if (x === 0 && y > 0) {
        return Math.PI / 2
    }
    if (x === 0 && y < 0) {
        return -Math.PI / 2
    }
}