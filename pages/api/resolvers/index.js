import axios from 'axios';
import path from 'path';
import getConfig from 'next/config'
import { promises as fs } from 'fs';

const handleAPICall = async () => {
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
						return data.map(entry => {
							return {
								name: entry.name,
								artist: {
									name: entry.artist['#text']
								},
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
	}
};
