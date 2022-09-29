import {G_LUNAR_JIEQI, HAN_TIANGAN, HAN_DIZHI, HAN_XINGCI, HAN_XINGZUO, HAN_NUMBER, HAN_DUAN} from './data.js'
import {SolarDate} from './solar.js'

export class GanZhiDate {
	constructor(solarDate) {
		const year = solarDate.year, month = solarDate.month, day = solarDate.day
		const hour = solarDate.hour, min = solarDate.min

		// 截取year年节气日期
		const data = G_LUNAR_JIEQI.slice(12 * (year - 1900), 12 * (year - 1900 + 1))

		// 计算干支对应公元纪年(ganzhi_year)和在干支纪月的第几个月份(ganzhi_month)
		// 元旦对应干支的上一年第11月
		let ganzhi_year = year - 1, ganzhi_month = 11, m = 1
		for (let it of data) {
			// 节气日是干支月变化的日期
			const jieqi_date = (15 - (it >> 4))
			if (month === m) {
				if (day >= jieqi_date) {
					ganzhi_month += 1
				}
				break
			}
			else {
				m += 1
				ganzhi_month += 1
			}
		}
		// 以上计数时12月以后按13月计算，接下来换回正常计数
		if (ganzhi_month > 12) {
			ganzhi_year += 1
			ganzhi_month -= 12
		}
		const year_tiangan = (ganzhi_year - 3) % 10 - 1
		const year_dizhi = (ganzhi_year - 3) % 12 - 1


		// 计算月天干次序：冬月对应地支为“子”，天干与年份有循环对应关系
		let month_tiangan = (ganzhi_year % 5 - 2) * 2 - 1
		month_tiangan = (month_tiangan < 0) ? (month_tiangan + 10) : month_tiangan
		month_tiangan += (ganzhi_month - 1) - 1
		month_tiangan %= 10
		const month_dizhi = (ganzhi_month + 1) % 12

		// 使用高氏日柱公式计算日天干次序（1~60，甲子~癸亥）
		const _month = [0, 31, -1, 30, 0, 31, 1, 32, 3, 33, 4, 34] // 月基数
		const _year = [3, 47, 31, 15, 0, 44, 28, 12, 57, 41] // 世纪常数（17 ~ 26世纪）
		const S = year % 100 - 1
		const U = S % 4
		const M = _month[month - 1]
		let R = Math.floor(S / 4) * 6 + 5 * (Math.floor(S / 4) * 3 + U) + M + day + _year[Math.floor((year - 1) / 100) + 1 - 17]
		if (SolarDate.isSolarLeapYear(year) && month > 2) {
			R += 1
		}
		R = R == 60 ? R : R % 60
		// 以上步骤得到日柱（日天干地支的次序数：1~60，下面将起点转化为0）
		R -= 1
		const day_tiangan = R % 10
		const day_dizhi = R % 12

		// 时天干与月天干类似，与日天干有循环对应关系
		const shi_tiangan = (((R % 10) % 5) * 2 + (Math.floor((hour + 1) / 2))) % 10
		const shi_dizhi = (Math.floor((hour + 1) / 2)) % 12

		// 计算多少刻：正点过后加4刻
		const keshu = (hour % 2 != 0) ? Math.floor(min / 15) + 1 : Math.floor(min / 15) + 1 + 4

		// 计算星次和星座
		const xingcishu = (ganzhi_month === 12 ? 0 : ganzhi_month)
		const this_month_zhongqi = 15 + (data[month - 1] & 0xf)
		const xingzuoshu = (day < this_month_zhongqi ? month - 1 : month) % 12

		const gengshu = (shi_dizhi > 9 || shi_dizhi < 3) ? (shi_dizhi + 2) % 12 + 1 : -1

		// 返回 干支年 月 日 时 地支时 刻 星次 星座
		this.year =	GanZhiDate._convert_to_ganzhi(year_tiangan, year_dizhi)
		this.month = GanZhiDate._convert_to_ganzhi(month_tiangan, month_dizhi)
		this.day = GanZhiDate._convert_to_ganzhi(day_tiangan, day_dizhi)
	    this.shi = GanZhiDate._convert_to_ganzhi(shi_tiangan, shi_dizhi)
		this.shichen = HAN_DIZHI[shi_dizhi] + '时'
		this.shichenAlias = HAN_DUAN[shi_dizhi]
		this.gengshu = gengshu != -1 ? HAN_NUMBER[gengshu] + '更' : ''
		this.keshu = HAN_NUMBER[keshu] + '刻'
		this.xingci = HAN_XINGCI[xingcishu]
		this.xingzuo = HAN_XINGZUO[xingzuoshu]
	}

	toString() {
		return `${this.year} ${this.month} ${this.day} ${this.shi}`
	}

	static _convert_to_ganzhi(tiangan, dizhi) {
		return HAN_TIANGAN[tiangan] + HAN_DIZHI[dizhi]
	}
}

