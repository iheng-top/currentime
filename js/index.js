import {SolarDate} from './calendar/solar.js'
import {LunarDate} from './calendar/lunar.js'
import {GanZhiDate} from './calendar/ganzhi.js'
import {JieQiInfo} from './calendar/jieqi.js'
import {Clock} from './clock/clock.js'


const solarDateNode = document.querySelector('#solar-date')
const lunarDateNode = document.querySelector('#lunar-date')
const ganZhiDateNode = document.querySelector('#ganzhi-date')
const shiChenNode = document.querySelector('#shichen-info')
const xingCiNode = document.querySelector('#xingci-info')
const xingZuoNode = document.querySelector('#xingzuo-info')
const jieQiInfoNode = document.querySelector('#jieqi-info')
const clockCanvasNode = document.querySelector('#clock-canvas')

let solarDate = new SolarDate(new Date())
let lunarDate = new LunarDate(solarDate)
let ganZhiDate = new GanZhiDate(solarDate)
let jieQiInfo = new JieQiInfo(solarDate)
solarDateNode.innerHTML = solarDate.toString()
lunarDateNode.innerHTML = lunarDate.toString()
ganZhiDateNode.innerHTML = ganZhiDate.toString()
shiChenNode.innerHTML = `${ganZhiDate.shichen}(${ganZhiDate.shichenAlias}${ganZhiDate.gengshu != '' ? ' · ' + ganZhiDate.gengshu : ''}) ${ganZhiDate.keshu}` 
xingCiNode.innerHTML = ganZhiDate.xingci
xingZuoNode.innerHTML = ganZhiDate.xingzuo
jieQiInfoNode.innerHTML = jieQiInfo.toString()


function flush() {
    // 每秒钟
    solarDate = new SolarDate(new Date())
    solarDateNode.innerHTML = solarDate.toString()

    // 每15分钟
    if (solarDate.min % 15 == 0) {
        ganZhiDate = new GanZhiDate(solarDate)
        shiChenNode.innerHTML = `${ganZhiDate.shichen}(${ganZhiDate.shichenAlias}${ganZhiDate.gengshu != '' ? ' · ' + ganZhiDate.gengshu : ''}) ${ganZhiDate.keshu}` 
        // 每小时
        if (solarDate.min == 0) {
            ganZhiDateNode.innerHTML = ganZhiDate.toString()
            // 每天
            if (solarDate.hour == 0 && solarDate.sec == 0) {
                lunarDate = new LunarDate(solarDate)
                jieQiInfo = new JieQiInfo(solarDate)
        
                lunarDateNode.innerHTML = lunarDate.toString()
                xingCiNode.innerHTML = ganZhiDate.xingci
                xingZuoNode.innerHTML = ganZhiDate.xingzuo
                jieQiInfoNode.innerHTML = jieQiInfo.toString()
            }
        }
    }
}

const clock = new Clock(document.querySelector('#utility-clock'))
clock.initClock()
clock.autoResize(327)
clock.goClock()
const flushClock = setInterval(flush, 1000)

