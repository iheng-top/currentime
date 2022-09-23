

export class SolarDate {
	static HAN_XINGQI = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"]

	static isSolarLeapYear(year) {
		return ((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0))
	}

	constructor(date) {
		this.year = date.getFullYear()
		this.month = date.getMonth() + 1
		this.day = date.getDate()
		this.week = date.getDay()
		this.hour = date.getHours()
		this.min = date.getMinutes()
		// second = 0是第1分钟
		this.sec = (date.getSeconds() + 1) % 60
	}

	toString() {
		return `${this.year}/${this.month}/${this.day} ${SolarDate.HAN_XINGQI[this.week - 1]} ${this.hour}:${this.min < 10 ? '0' : ''}${this.min}:${this.sec < 10 ? '0' : ''}${this.sec}`
	}
}


