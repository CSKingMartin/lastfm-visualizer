import MonthBar from './partials/month-bar';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import getMonthFromDate from '../../assets/js/helpers';

const client = new ApolloClient({
	 uri: '/api/graphql/',
	 cache: new InMemoryCache()
});

// TODO: place 1464764400 (June 01, 2016) as a default start date in the env file
const craftQuery = (start) => {
	let startDate = start;
	let queryString = `
		query {
	`;

	for (let i = 0; i < 12; i++) {
		const queryName = new Date(startDate * 1000).toLocaleString('en-US', {
			month: 'long',
		});
	
		queryString += `
			${queryName}: getScrobblesForRange(start: "${startDate}", end: "${getMonthFromDate(startDate)}") {
				count
				scrobbles {
					song {
						name
					}
				}
			}
		`;
	
		startDate = getMonthFromDate(startDate);
	}
	queryString += '}';

	return gql`${queryString}`;
};

async function getStaticProps(args) {
	const { data } = await client.query({
		query: craftQuery(args.start)
	});
	
	let max = 0;
	Object.keys(data).map(key => {
		const { count } = data[key];
		if (count > max) {
			max = count;
		}
	});

	return {
		maxMonthly: max,
		months: data
	};
}

export const LastFMTimeline = (props) => {
	const {
		start,
		className,
		children,
		...rest
	} = props;
	
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState({});
	
	useEffect(() => {
		if (loading) {
			getStaticProps({ start: start ? start : '1464764400' }).then(data => {
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
					{(!loading && data.months) &&
						Object.keys(data.months).map((key, index) => {
							const entry = data.months[key];

							return (
								<div key={index}>
									<MonthBar month={key} year="2016" maxScrobbles={data.maxMonthly} injectedData={entry} />
								</div>	
							);
						})
					}
				</div>
			</div>
		</div>
	)
};

export default LastFMTimeline;
