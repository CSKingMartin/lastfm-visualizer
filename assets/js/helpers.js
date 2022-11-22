export const getMonthFromDate = (startDate) => {
	const jsDate = new Date(startDate * 1000);
	const monthInt = jsDate.getMonth() + 1;
	const month = monthInt.toString().charAt(1) ? monthInt.toString() : '0' + monthInt.toString();

	let monthDuration;
	switch(month) {
		case '01':
		case '05':
		case '07':
		case '08':
		case '10':
		case '12':
			monthDuration = 2678400;
			break;
		case '03':
			monthDuration = 2674800; //dst
			break;
		case '04':
		case '06':
		case '09':
			monthDuration = 2592000;
			break;
		case '11':
			monthDuration = 2595600; //dst
			break;
		case '02':
			if (!(jsDate.getFullYear() % 4)) {
				monthDuration = 2419200;
			} else {
				monthDuration = 2419200
			}
			break;
		default:
			monthDuration = 0;
	}
	
	const sum = parseInt(startDate, 10) + monthDuration;	
	
	return sum;
};

export default getMonthFromDate;
