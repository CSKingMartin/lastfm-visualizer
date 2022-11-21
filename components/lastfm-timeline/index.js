import MonthBar from './partials/month-bar';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useEffect, useState } from 'react';

const client = new ApolloClient({
	 uri: '/api/graphql/',
	 cache: new InMemoryCache()
});

const query = gql`
	query {
	  getScrobblesForYear(month: "03", year:"2017") {
		months {
		  count
		  month
		  year
		}
	  }
	}
`;

async function getStaticProps(args) {
	const { data } = await client.query({
		query: query
	});

	return data.getScrobblesForYear;
}

export const LastFMTimeline = (props) => {
	const {
		className,
		children,
		...rest
	} = props;
	
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState([]);
	
	useEffect(() => {
		if (loading) {
			getStaticProps().then(data => {
				setData(data);
				setLoading(false);
			});
		}
	});
	
	return (
		<div className="lastfm-timeline">
			<div className="lastfm-timeline__graph">
				<div className="lastfm-timeline__graph-data">
					{loading && <p>Loading...</p>}
					{(!loading && data) &&
						data.months.map(element => {
							// console.log('from year', element);
							return (
								<MonthBar month={element.month} year={element.year} injectedData={element} />
							)
						})
					}
				</div>
			</div>
		</div>
	)
};

export default LastFMTimeline;
