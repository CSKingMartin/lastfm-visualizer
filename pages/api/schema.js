import { gql } from 'apollo-server-express';

export const typeDefs = gql`
	type Scrobble {
		song: Song
		artist: Artist
		album: Album
		date: Date
	}
	
	type Date {
		uts: String
		text: String
	}
	
	type Album {
		name: String!
		playcount: Int
		artist: Artist
	}
	
	type Artist {
		name: String!
		playcount: Int
	}
	
	type Song {
		name: String!
		playcount: Int
	}
	
	type Month {
		month: String
		year: String
		artists: [Artist]
		albums: [Album]
		count: Int
		scrobbles: [Scrobble]
		topAlbums: [Album]
		topArtists: [Artist]
		topSongs: [Song]
	}
	
	type Year {
		text: String!
		months: [Month]
	}

	type Query {
		allScrobbles: [Scrobble!]!
		scrobbleCount: Int
		countScrobblesInMonth(month: String, year: String): Int
		findScrobblesWithNoDate: [Scrobble]
		getScrobblesForMonth(month: String, year: String): Month
		getScrobblesForYear(month: String, year: String): Year
		getScrobbleTimeline: [Year]
	}
`;
