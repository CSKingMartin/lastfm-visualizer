import { filterUnwantedData, getMonthDateRange } from '../helpers';
import { parseMonthData } from './get-month-scrobbles';
import { handleAPICall } from './index';

export default async function (parent, args) {
	try {		
		return await handleAPICall()
			.then((data) => {
				const months = [];
				let startMonth = args.month || 1;

				for (let i = 0; i < 12; i++) {
					const month = startMonth.toString().charAt(1) ? `${startMonth}` : `0${startMonth}`;
					const bounds = getMonthDateRange(month, args.year);
					
					months.push({
						year: args.year,
						month: month,
						...filterUnwantedData(parseMonthData(data, bounds))
					});
					
					startMonth = parseInt(startMonth, 10) < 12 ? parseInt(startMonth, 10) + 1 : 1;
				}

				return {
					text: args.year,
					months: months
				};
			});
	} catch (error) {
		throw error;
	}
};
