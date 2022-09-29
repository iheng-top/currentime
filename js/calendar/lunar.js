import {
	G_LUNAR_YEAR_DAY, 
	G_LUNAR_MONTH_DAY,
	START_YEAR,
	MONTH_DAY_BIT,
	MONTH_NUM_BIT,
	HAN_NUMBER,
	HAN_YUEFEN,
	HAN_RIQI
} from './data.js'

export class LunarDate {
	/**
	 * 
	 * @param {Number} lunar_year 农历年(1900 ~ 2100)
	 * @param {Number} lunar_month 农历月(1 ~ 12)
	 * @returns {Number[]} [闰月月份, 闰月天数]
	 */
	static getLeapMonthInfo(lunar_year) {
		// 闰月月份 闰月天数
		let leap_month = 0, leap_month_days = 0

		// 获取lunar_year年各月的天数
		const data = G_LUNAR_MONTH_DAY[lunar_year - START_YEAR]

		leap_month = (data >> MONTH_NUM_BIT) & 0xf
		if (leap_month) {
			if (data & (1 << MONTH_DAY_BIT)) {
				leap_month_days = 30
			}
			else {
				leap_month_days = 29
			}
		}
		return {
			leapMonth: leap_month,
			leapMonthDays: leap_month_days
		}
	}


	/**
	 * 
	 * @param {Number} lunar_year 农历年(1900 ~ 2100)
	 * @param {Number} lunar_month 农历月(1 ~ 12)
	 */
	static getLunarMonthDays(lunar_year, lunar_month) {
		return (G_LUNAR_MONTH_DAY[lunar_year - START_YEAR] & (1 << (lunar_month - 1))) ? 30 : 29
	}


	/**
	 * 
	 * @param {Number} year 公历年(1900 ~ 2100)
	 * @param {Number} month 公历月(1 ~ 12)
	 * @param {Number} day 公历日(1 ~ 31)
	 */
	constructor(solarDate) {
		const year = solarDate.year, month = solarDate.month, day = solarDate.day
		let lunar_year = year, lunar_month = 1, lunar_day = 1
		let is_leap = false
		// 获取year年春节的公历信息
		const data = G_LUNAR_YEAR_DAY[year - START_YEAR]
		const chunjie_month = (data >> 5) & 0x3
		const chunjie_day = data & 0x1f
		const leapMonthInfo = LunarDate.getLeapMonthInfo(lunar_year)
		
		// Date中month的范围是0~11，而day的范围却是1~31
		let span_days = (new Date(year, month - 1, day).valueOf() - new Date(year, chunjie_month - 1, chunjie_day).valueOf()) / 86400000
		if (span_days >= 0) {
			let month_days = LunarDate.getLunarMonthDays(lunar_year, lunar_month)
			while (span_days >= month_days) {
				span_days -= month_days
				// 闰月
				if (lunar_month === leapMonthInfo.leapMonth) {
					// 日期在闰月中
					if (span_days < leapMonthInfo.leapMonthDays) {
						is_leap = true
						break
					}
					span_days -= leapMonthInfo.leapMonthDays
				}
				// 判断闰月后月份+1
				lunar_month += 1
				month_days = LunarDate.getLunarMonthDays(lunar_year, lunar_month)
			}
			lunar_day += span_days
		}
		else {
			lunar_month = 12
			lunar_year -= 1
			let month_days = LunarDate.getLunarMonthDays(lunar_year, lunar_month)
			while (Math.abs(span_days) >= month_days) {
				span_days += month_days
				lunar_month -= 1
				if (lunar_month === leapMonthInfo.leapMonth) {
					if (Math.abs(span_days) < month_days) {
						is_leap = true
						break
					}
					span_days += leapMonthInfo.leapMonthDays
				}
				month_days = LunarDate.getLunarMonthDays(lunar_year, lunar_month)
			}
			lunar_day += (month_days + span_days)
		}
		this.lunarYear = lunar_year
		this.xyYear = lunar_year + 2697
		this.lunarMonth = lunar_month
		this.lunarDay = lunar_day
		this.isLeap = is_leap
	};

	toString() {
		let han_year = ''
		for (let it of String(this.lunarYear)) {
			han_year += HAN_NUMBER[Number(it)]
		}

		let han_xy_year = ''
		for (let it of String(this.xyYear)) {
			han_xy_year += HAN_NUMBER[Number(it)]
		}

		let han_month = HAN_YUEFEN[this.lunarMonth - 1]
		if (this.isLeap) {
			han_month = '闰' + han_month
		}
		return `${han_year}年(开元${han_xy_year}年) ${han_month} ${HAN_RIQI[this.lunarDay - 1]}`
	}
}

