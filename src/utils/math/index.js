export const rand = (to, from = 0) => from + Math.floor((to - from + 1) * Math.random())

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
    return { x: y / length, y: -x / length }
}

export const normalize = (x, y) => {
    const magnitude = len(x, y)
    return { x: x / magnitude, y: y / magnitude }
}

export const easingFns = {
    // Linear
    linear(x) {
        return x;
    },

    // Quadratic
    quadIn(x) {
        return x * x;
    },
    quadOut(x) {
        return 1 - quadIn(1 - x);
    },
    quadInOut(x) {
        return x < 0.5 ? 2 * x * x : 1 - 2 * Math.pow(x - 1, 2);
    },

    // Cubic
    cubicIn(x) {
        return x * x * x;
    },
    cubicOut(x) {
        return 1 - cubicIn(1 - x);
    },
    cubicInOut(x) {
        return x < 0.5 ? 4 * x * x * x : 1 - 4 * Math.pow(x - 1, 3);
    },

    // Quartic
    quartIn(x) {
        return x * x * x * x;
    },
    quartOut(x) {
        return 1 - quartIn(1 - x);
    },
    quartInOut(x) {
        return x < 0.5 ? 8 * x * x * x * x : 1 - 8 * Math.pow(x - 1, 4);
    },

    // Quintic
    quintIn(x) {
        return x * x * x * x * x;
    },
    quintOut(x) {
        return 1 - quintIn(1 - x);
    },
    quintInOut(x) {
        return x < 0.5 ? 16 * x * x * x * x * x : 1 - 16 * Math.pow(x - 1, 5);
    },

    // Sine
    sineIn(x) {
        return 1 - Math.cos(x * Math.PI / 2);
    },
    sineOut(x) {
        return Math.sin(x * Math.PI / 2);
    },
    sineInOut(x) {
        return 0.5 * (1 - Math.cos(Math.PI * x));
    },

    // Exponential
    expoIn(x) {
        return x === 0 ? 0 : Math.pow(2, 10 * (x - 1));
    },
    expoOut(x) {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    },
    expoInOut(x) {
        return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * (x - 1))) / 2;
    },

    // Circular
    circIn(x) {
        return 1 - Math.sqrt(1 - x * x);
    },
    circOut(x) {
        return Math.sqrt(1 - Math.pow(x - 1, 2));
    },
    circInOut(x) {
        return x < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
    },

    // Elastic
    elasticIn(x) {
        return x === 0 ? 0 : x === 1 ? 1 : -Math.pow(2, 10 * (x - 1)) * Math.sin((x - 1.1) * 5 * Math.PI);
    },
    elasticOut(x) {
        return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x - 0.1) * 5 * Math.PI) + 1;
    },
    elasticInOut(x) {
        return x === 0 ? 0 : x === 1 ? 1 : x < 0.5
            ? -0.5 * Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11) * Math.PI / 5)
            : 0.5 * Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11) * Math.PI / 5) + 1;
    },

    // Back
    backIn(x) {
        const s = 1.70158;
        return x * x * ((s + 1) * x - s);
    },
    backOut(x) {
        const s = 1.70158;
        return (x - 1) * (x - 1) * ((s + 1) * (x - 1) + s) + 1;
    },
    backInOut(x) {
        const s = 1.70158 * 1.525;
        return x < 0.5
            ? 0.5 * (x * x * ((s + 1) * 2 * x - s) - 1)
            : 0.5 * ((2 * x - 2) * (2 * x - 2) * ((s + 1) * (2 * x - 2) + s) + 2);
    },

    // Bounce
    bounceIn(x) {
        return 1 - bounceOut(1 - x);
    },
    bounceOut(x) {
        if (x < (1 / 2.75)) {
            return 7.5625 * x * x;
        } else if (x < (2 / 2.75)) {
            return 7.5625 * (x - 1.5 / 2.75) * (x - 1.5 / 2.75) + 0.75;
        } else if (x < (2.5 / 2.75)) {
            return 7.5625 * (x - 2.25 / 2.75) * (x - 2.25 / 2.75) + 0.9375;
        } else {
            return 7.5625 * (x - 2.625 / 2.75) * (x - 2.625 / 2.75) + 0.984375;
        }
    },
    bounceInOut(x) {
        return x < 0.5
            ? (1 - bounceOut(1 - 2 * x)) / 2
            : (1 + bounceOut(2 * x - 1)) / 2;
    }
};

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