import { filterUnwantedData, getMonthDateRange, compareTwoStrings, getTopTen } from '../helpers';
import { handleAPICall } from './index';

export const parseMonthData = (data, bounds) => {
	const asArray = Object.entries(data);
	
	const filteredData = asArray.filter(object => {
		if (object[1] && object[1].date) {
			const { date } =  object[1];			
			return date.uts <= bounds.end && date.uts >= bounds.start;
		}
	});

	return filteredData;
}

export default async function (parent, args) {
	try {
		const bounds = getMonthDateRange(args.month, args.year);
		
		return await handleAPICall()
			.then((data) => {
				const dataSlice = parseMonthData(data, bounds);

				return {
					month: args.month,
					year: args.year,
					...filterUnwantedData(dataSlice)
				};
			});
	} catch (error) {
		throw error;
	}
};
