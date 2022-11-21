export const filterUnwantedData = (data) => {
	const recompiled = Object.fromEntries(data);
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
			albums.unshift({name: album, playcount: 1, artist: { name: artist } });
		}
	
		const newEntry = {
			album: {
				name: entry.album['#text'],
				artist: {
					name: entry.artist['#text']
				}
			},
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
	
	// alphabetize the artist list
	artists.sort((a, b) => compareTwoStrings(a.name, b.name));
	albums.sort((a, b) => compareTwoStrings(a.name, b.name));
	
	return {
		artists: artists,
		albums: albums,
		count: output.length,
		scrobbles: output,
		topArtists: getTopTen(artists),
		topAlbums: getTopTen(albums)
	};
};

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

export const getTopTen = (array) => {
	const arrayCopy = array.slice();
	
	return arrayCopy.sort((a, b) => {
		if (a.playcount < b.playcount) {
			return 1;
		} else {
			return -1;
		}
	}).slice(0, 10);	
}

export const compareTwoStrings = (stringA, stringB) => {
	const wordsA = stringA.split(' ');
	const wordsB = stringB.split(' ');
	
	const compareWords = (index = 0) => {
		// console.log('comparing ', wordsA[index], wordsB[index]);
		if (wordsA[index].localeCompare(wordsB[index]) > 0) { // a before b based on the first words
			// console.log(`${a.name} comes before ${b.name} based on the ${index + 1} word`);
			return 1;
		} else if (wordsA[index].localeCompare(wordsB[index]) < 0) { // b before a
			// console.log(`${b.name} comes before ${a.name} based on the ${index + 1} word`);
			return -1
		} else if (wordsA[index].localeCompare(wordsB[index]) === 0) { // if they begin with the same word
			// console.log(`${b.name} and ${a.name} have the same word in the ${index + 1} spot`);
			if (wordsA[index + 1] && !wordsB[index + 1]) { // A has a 2nd word, B does not
				// console.log(`${b.name} comes before ${a.name} because b has no ${index + 1} word`);
				return -1;
			} else if (!wordsA[index + 1] && wordsB[index + 1]) { // B has a 2nd word, A does not
				// console.log(`${a.name} comes before ${b.name} because a has no ${index + 1} word`);
				return 1;
			} else if (!wordsA[index + 1] && !wordsB[index + 1]) {
				return 0;
			} else {
				return compareWords(index + 1);
			}
		} else {
			return 0;
		}
	};
	
	return compareWords();
}

export default getMonthDateRange;