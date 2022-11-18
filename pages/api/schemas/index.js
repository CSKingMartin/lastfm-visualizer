import { gql } from 'apollo-server-express';

export const typeDefs = gql`
	type Scrobble {
		name: String
		artist: Artist
	}
	
	type Artist {
		name: String
	}

	type Query {
		allScrobbles: [Scrobble!]!
		scrobbleCount: Int
	}
`;
