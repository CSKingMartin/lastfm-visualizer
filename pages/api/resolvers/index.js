import axios from 'axios';
import path from 'path';
import getConfig from 'next/config'
import { promises as fs } from 'fs';
import getMonthDateRange from '../helpers/';

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
		scrobblesForMonth: async (parent, args) => {
			try {
				const bounds = getMonthDateRange(args.month, args.year);
				
				return await handleAPICall()
					.then((data) => {
						const asArray = Object.entries(data);
						
						const filteredData = asArray.filter(object => {
							if (object[1] && object[1].date) {
								const { date } =  object[1];
								return date.uts < bounds.end && date.uts > bounds.start;
							}
						});
						
						const recompiled = Object.fromEntries(filteredData);
						const output = [];
						const artists = [];
						const albums = [];

						Object.keys(recompiled).forEach(key => {
							const entry = recompiled[key];
							const artist = entry.artist['#text'];
							const artistIndex = artists.findIndex((element) => element.name === artist);
							
							const album = entry.album['#text'];
							const albumIndex = albums.findIndex((element) => element.name === album);
							
							if (artistIndex !== -1) {
								artists[artistIndex].playcount++;
							} else {
								artists.unshift({name: artist, playcount: 1});
							}
							
							if (albumIndex !== -1) {
								albums[albumIndex].playcount++;
							} else {
								albums.unshift({name: album, playcount: 1});
							}

							const newEntry = {
								artist: {
									name: entry.artist['#text'],
								},
								date: {
									uts: entry.date.uts,
									text: entry.date['#text']
								},
								song: {
									name: entry.name,
								}
							}
							
							output.unshift(newEntry);
						});
						
						artists.sort((a, b) => {
							if (a.playcount < b.playcount) {
								return 1;
							} else {
								return -1;
							}
						});
						
						albums.sort((a, b) => {
							if (a.playcount < b.playcount) {
								return 1;
							} else {
								return -1;
							}
						});
						
						console.log(albums);

						return {
							artists: artists,
							albums: albums,
							count: output.length,
							scrobbles: output
						};
					});
			} catch (error) {
				throw error;
			}
		}
	},
	Mutation: {
		removeBadEntries: async () => {
			try {
				const scrobbleData = await handleAPICall()
					.then((data) => {
						let count = 0;
						return data.map(entry => {
							if (entry.date) {
								return {
									name: entry.name,
									artist: {
										name: entry.artist['#text']
									}
								};
							}
					})})
					
				return scrobbleData.filter(entry => entry);
			  } catch (error) {
				throw error;
			  }
		},
	}
};
