import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
	type Scrobble {
		name: String
	}
	
	type Query {
		getScrobbles: [Scrobble]
	}
`;
