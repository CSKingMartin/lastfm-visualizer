import axios from 'axios';
import path from 'path';
import getConfig from 'next/config'
import { promises as fs } from 'fs';
import { default as getScrobblesForMonth } from './get-month-scrobbles';
import { default as getScrobblesForYear } from './get-year-scrobbles';
import { getMonthDateRange } from '../helpers';
import { parseMonthData } from './get-month-scrobbles';

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
		getScrobblesForMonth: async (parent, args) => await getScrobblesForMonth(parent, args),
		getScrobblesForYear: async (parent, args) => await getScrobblesForYear(parent, args),
		countScrobblesInMonth: async (parent, args) => {
			/*
				1. Set the 'max scrobbles' only for the range provided
				2. we will add to the range as we pull more data
				3. adjust the graph based on an animation / recalculation of heights for the MonthBars
			*/
			try {
				const scrobbles = await handleAPICall()
					.then((data) => {
						let bounds;

						if (args.month && args.year) {
							bounds = getMonthDateRange(args.month, args.year);
						} else {
							bounds = getMonthDateRange('06', '2016'); // default year / month
						}

						const dataSlice = parseMonthData(data, bounds);
						return dataSlice.length;
					})
				return scrobbles;
			} catch (error) {
				throw error;
			}
		}
	},
	// Mutation: {
	// 	removeBadEntries: async () => {
	// 		try {
	// 			const scrobbleData = await handleAPICall()
	// 				.then((data) => {
	// 					let count = 0;
	// 					return data.map(entry => {
	// 						if (entry.date) {
	// 							return {
	// 								name: entry.name,
	// 								artist: {
	// 									name: entry.artist['#text']
	// 								}
	// 							};
	// 						}
	// 				})})
	// 				
	// 			return scrobbleData.filter(entry => entry);
	// 		  } catch (error) {
	// 			throw error;
	// 		  }
	// 	},
	// }
};
