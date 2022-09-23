import {G_LUNAR_JIEQI, HAN_JIEQI} from './data.js'


export class JieQiInfo {
	static START_YEAR = 1901

	constructor(solarDate) {
		const year = solarDate.year, month = solarDate.month, day = solarDate.day
		const last_month = G_LUNAR_JIEQI[12 * (year - JieQiInfo.START_YEAR) + month - 2]
		const this_month = G_LUNAR_JIEQI[12 * (year - 1900) + month - 1]
		const next_month = G_LUNAR_JIEQI[12 * (year - 1900) + month]
		const l_jieqi = 15 - (last_month >> 4), l_zhongqi = 15 + (last_month & 0xf)
		const jieqi = 15 - (this_month >> 4), zhongqi = 15 + (this_month & 0xf)
		const n_jieqi = 15 - (next_month >> 4), n_zhongqi = 15 + (next_month & 0xf)
		let this_jieqi = '', next_jieqi = '', next_jieqi_month = 0, next_jieqi_day = 0, l_num = 0, num = 0

		const l_month = month === 1 ? 12 : month - 1, l_year = month === 1 ? year - 1 : year
		const n_month = month === 12 ? 1 : month + 1, n_year = month === 12 ? year + 1 : year
		const t_now = Date.UTC(year, month, day)
		const tl_zhongqi = Date.UTC(l_year, l_month, l_zhongqi)
		const t_jieqi = Date.UTC(year, month, jieqi)
		const t_zhongqi = Date.UTC(year, month, zhongqi)
		const tn_jieqi = Date.UTC(n_year, n_month, n_jieqi)
		
		// 上月中气(l_year, l_month, l_zhongqi) 本月节气(year, month, jieqi) 本月中气(year, month, zhingqi) 下月节气(n_year, n_month, n_jieqi)
		if (day < jieqi) {
			// 上月中气 ~ 本月节气前
			this_jieqi = HAN_JIEQI[month === 1 ? 23 : (month - 2) * 2 + 1]
			next_jieqi = HAN_JIEQI[(month - 1) * 2]
			next_jieqi_month = month
			next_jieqi_day = jieqi
			l_num = Math.floor((t_now - tl_zhongqi) / 86400000)
			num = Math.floor((t_jieqi - t_now) / 86400000)
		}
		else if (day === jieqi || day < zhongqi) {
			this_jieqi = HAN_JIEQI[(month - 1) * 2]
			next_jieqi = HAN_JIEQI[(month - 1) * 2 + 1]
			next_jieqi_month = month
			next_jieqi_day = zhongqi
			l_num = Math.floor((t_now - t_jieqi) / 86400000)
			num = Math.floor((t_zhongqi - t_now) / 86400000)
		}
		else {
			this_jieqi = HAN_JIEQI[(month - 1) * 2 + 1]
			next_jieqi_month = month === 12 ? 1 : month + 1
			next_jieqi_day = n_jieqi
			next_jieqi = HAN_JIEQI[(next_jieqi_month - 1) * 2]
			l_num = Math.floor((t_now - t_zhongqi) / 86400000)
			num = Math.floor((tn_jieqi - t_now) / 86400000)
		}

		// 当前节气名 持续天数 下一节气名 下一节气月 下一节气日 还有多少天
		this.thisJieQi = this_jieqi
		this.continueDays = l_num
		this.nextJieQi = next_jieqi
		this.nextJieQiDate = {
			month: next_jieqi_month,
			day: next_jieqi_day
		}
		this.stillDays = num
	}

	toString() {
		if (this.continueDays == 0) {
			return `今天是[${this.thisJieQi}], 距离下个节气[${this.nextJieQi}(${this.nextJieQiDate.month}月${this.nextJieQiDate.day}日)]还有${this.stillDays}天`
		}
		else {
			return `距离上个节气[${this.thisJieQi}]已经过去${this.continueDays}天，距离下个节气[${this.nextJieQi}(${this.nextJieQiDate.month}月${this.nextJieQiDate.day}日)]还有${this.stillDays}天`
		}
	}
}
