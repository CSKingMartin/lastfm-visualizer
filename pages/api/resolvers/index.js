export const resolvers = {
  Query: {
	getScrobbles: async () => {
	  try {
		const scrobbles = await axios.get("data.json");
		return scrobbles.data.map(({ artist, album, name }) => ({
		  artist,
		  album,
		  name
		}));
	  } catch (error) {
		throw error;
	  }
	}
  }
};
