import Cors from 'micro-cors';
import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

const apolloServer = new ApolloServer({ typeDefs, resolvers });
const cors = Cors();

export const config = {
	api: {
		bodyParser: false,
		responseLimit: false
	}
};

const startServer = apolloServer.start();

export default cors(async (req, res) => {
	if (req.method === "OPTIONS") {
		res.end();
		return false;
	}
	
	await startServer;
	await apolloServer.createHandler({ path: '/api/graphql' })(req, res);
});
