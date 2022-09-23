

export class Clock {
    constructor(container) {
        this.container = container;
        this.dynamic = container.querySelector(".dynamic")
        this.hourPin = container.querySelector(".hour")
        this.minutePin = container.querySelector(".minute")
        this.secondPin = container.querySelector(".second")
    }

    autoResize() {
        //自动调整时钟大小
        const resize = (nativeSize) => {
            const scale = Math.min(window.innerWidth, window.innerHeight) / nativeSize
            this.container.style.transform = this.container.style.webkitTransform = 'scale(' + scale.toFixed(3) + ')'
        }
        resize()
        window.addEventListener('resize', resize)
    }

    initClock() {
        //初始化表盘
        const minute = (n) => {
            return n % 5 == 0 ? minuteText(n) : minuteLine(n)
        }
        const minuteText = (n) => {
            const element = document.createElement('div')
            element.className = 'minute-text'
            element.innerHTML =(n < 10 ? '0' : '') + n
            position(element, n / 60, 135)
            this.dynamic.appendChild(element)
        }
        const minuteLine = (n) => {
            const anchor = document.createElement('div')
            anchor.className = 'anchor'
            const element = document.createElement('div')
            element.className = 'element minute-line'
            this.rotate(anchor, n)
            anchor.appendChild(element)
            this.dynamic.appendChild(anchor)
        }
        const hour = (n) => {
            const element = document.createElement('div')
            element.className = 'hour-text hour-' + n
            element.innerHTML = n
            position(element, n / 12, 105)
            this.dynamic.appendChild(element)
        }
        const position = (element, phase, r) => {
            const theta = phase * 2 * Math.PI
            element.style.top = (-r * Math.cos(theta)).toFixed(1) + 'px'
            element.style.left = (r * Math.sin(theta)).toFixed(1) + 'px'
        }
        for (let i = 1;i<=60; i ++) {
            minute(i)
        }
        for (let i = 1; i <= 12; i ++) {
            hour(i)
        }
    }

    goClock(solarDate) {
        //时钟显示时间改变
        const inner = () => {
            const now = new Date()
            const time = now.getHours() * 3600 +
                    now.getMinutes() * 60 +
                    now.getSeconds() * 1 +
                    now.getMilliseconds() / 1000
            this.rotate(this.secondPin, time)
            this.rotate(this.minutePin, time / 60)
            this.rotate(this.hourPin, time / 60 / 12)
            requestAnimationFrame(inner)
        }
        inner()
    }

    rotate(element, second) {
        element.style.transform = element.style.webkitTransform = 'rotate(' + (second * 6) + 'deg)'
    }
}
