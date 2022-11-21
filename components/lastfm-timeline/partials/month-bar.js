import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useEffect, useState } from 'react';

const craftQuery = (month = '01', year = '2021') => gql`
	query MonthBarScrobbles {
		getScrobblesForMonth(month: "${month}", year: "${year}") {
			count
			topArtists {
				name
				playcount
			}
		}
	}
`;

const client = new ApolloClient({
 	uri: '/api/graphql/',
 	cache: new InMemoryCache()
});

async function getStaticProps(args) {
	const { data } = await client.query({
		query: craftQuery(args.month, args.year)
	});

    return data.getScrobblesForMonth;
}

export const MonthBar = (props) => {
	const {
		injectedData,
		maxScrobbles, // contextual from graph, how 'high' to grow...
		month,
		year,
		children,
		...rest
	} = props;

	const [data, setData] = useState(injectedData ? injectedData : {});
	const [loading, setLoading] = useState(injectedData === undefined);
	
	useEffect(() => {
		if (loading) {
			getStaticProps({ month, year }).then(data => {
				setData(data);
				setLoading(false);
			});
		}
	});
	
	return (
		<div className="lastfm-timeline__month-bar">
			{loading && <div>Loading...</div>}
			{!loading &&
				<div>There were {data.count} Scrobbles during {month || data.month}, {year || data.year}</div>
			}
		</div>
	);
};

export default MonthBar;
