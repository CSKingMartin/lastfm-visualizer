export const getMonthDateRange = (startMonth, startYear) => {
	// console.log('hello from resolver', startMonth, startYear);
	
	// generate UTS for start date
	const dateStr = startYear + '-' + startMonth + '-01';
	const date = new Date(dateStr);
	
	// 25200 is 7 hours difference from GMT, fuck you Daylight Savings
	const timestamp = (Math.floor(date.getTime() / 1000) + 25200);
	
	// determine end date via which month of the year we are looking at.
	let monthDuration;
	switch(startMonth) {
		case '01':
		case '03':
		case '05':
		case '07':
		case '08':
		case '10':
		case '12':
			monthDuration = 2678400;
			break;
		case '04':
		case '06':
		case '09':
		case '11':
			monthDuration = 2592000;
			break;
		case '02':
			if (!(startYear % 4)) {
				monthDuration = 2419200;
			} else {
				monthDuration = 2505600
			}
			break;
		default:
			monthDuration = 0;
	}
	
	// sum start UTS with the duration of the given month to return the end date
	const sum = parseInt(timestamp, 10) + monthDuration;
	// console.log(startMonth, startYear, timestamp, parseInt(timestamp, 10), monthDuration, sum);
	
	return {
		start: timestamp,
		end: sum
	};
};

export default getMonthDateRange;