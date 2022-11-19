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
	}
	
	type Artist {
		name: String!
		playcount: Int
	}
	
	type Song {
		name: String!
		playcount: Int
	}
	
	type MonthStatistics {
		artists: [Artist]
		albums: [Album]
		count: Int
		scrobbles: [Scrobble]
	}

	type Query {
		allScrobbles: [Scrobble!]!
		scrobbleCount: Int
		findScrobblesWithNoDate: [Scrobble]
		scrobblesForMonth(month: String, year: String): MonthStatistics
	}
`;
