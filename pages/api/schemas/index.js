import { gql } from 'apollo-server-express';

export const typeDefs = gql`
	type Scrobble {
		name: String
		artist: String
		date: Date
	}
	
	type Date {
		uts: String
		text: String
	}
	
	type Mutation {
		removeBadEntries: [Scrobble]
	}

	type Query {
		allScrobbles: [Scrobble!]!
		scrobbleCount: Int
		findScrobblesWithNoDate: [Scrobble]
		scrobblesForMonth(month: String, year: String): [Scrobble]!
	}
`;
