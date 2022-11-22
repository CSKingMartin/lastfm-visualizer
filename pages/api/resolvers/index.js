import axios from 'axios';
import path from 'path';
import getConfig from 'next/config'
import { promises as fs } from 'fs';
import { filterUnwantedData, getMonthDateRange, parseRangeData } from '../helpers';

export const handleAPICall = async () => {
	try {
		// TODO: needs a dev / production environment choice here
		const response = await axios.get('http://localhost:3000/master-scrobbles.json',
			{ headers: {
				Accept: 'application/json, text/plain, */*',
				'User-Agent': '*',
				'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59'
			}});
		
		return response.data;
    } catch (error) {
		throw error;
	}
};

export const resolvers = {
	Query: {
		allScrobbles: async () => {
			try {
				const scrobbleData = await handleAPICall()
					.then((data) => {
						let count = 0;
						return data.map(entry => {
							return {
								name: entry.name,
								artist: {
									name: entry.artist['#text']
								}
							};
					})})
	
				return scrobbleData;
	  		} catch (error) {
				throw error;
	  		}
		},
		scrobbleCount: async () => {
			try {
				return await handleAPICall()
					.then((data) => {
						return data.length;
					});
			} catch (error) {
				throw error;
			}
		},
		getScrobblesForRange: async (parent, args) => {
			try {
				const {
					start,
					duration,
					end
				} = args;

				const scrobbles = await handleAPICall()
					.then((data) => {
						let bounds;
						let parsedData;

						if (start && end) {	
							parsedData = parseRangeData(data, { start: start, end: end })
						} else if (start && duration) {
							const endDate = parseInt(start, 10);
							let durationInUTS;
							
							switch (duration) {
								case 'Year':
								case 'year':
									durationInUTS = 31556926;
									parsedData = parseRangeData(data, { start: start, end: parseInt(start, 10) + durationInUTS });
									break;
								case 'Month':
								case 'month':
									const dateConversion = new Date(start * 1000);
									const month = dateConversion.getMonth().toString().charAt(2) ? dateConversion.getMonth().toString() : `0${dateConversion.getMonth().toString()}`

									const range = getMonthDateRange(month, dateConversion.getFullYear());
									
									parsedData = parseRangeData(data, range);
									console.log(parsedData);
									break;
								case 'Week':
								case 'week':
									durationInUTS = 604800;
									parsedData = parseRangeData(data, { start: start, end: parseInt(start, 10) + durationInUTS });
									
									break;
								default:
									parsedData = parseRangeData(data, { start: start, end: '1669068087' })
									break;
							}
						} else {
							bounds = getMonthDateRange('06', '2016'); // default year / month
							parsedData = parseRangeData(data, bounds);
						}
						
						return {
							count: parsedData.length,
							scrobbles: filterUnwantedData(Object.values(parsedData)).scrobbles
						};
					});
				
				return scrobbles;
			} catch (error) {
				throw error;
			}
		}
	},
};
