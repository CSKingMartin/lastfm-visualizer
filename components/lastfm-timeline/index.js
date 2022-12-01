import MonthBar from './partials/month-bar';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import React, { useEffect, useState } from 'react';
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

const DefaultMonthSet = (props) => {
	const {
		loadedData,
		max,
		...rest
	} = props;
	
	let months = [];
	
	for (let i = 0; i < 12; i++) {
		const abbr = new Intl.DateTimeFormat("en-US", { month: "short" }).format(new Date('1995', `0${i + 5}`));
		const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date('1995', `0${i + 5}`));
		
		months.push(
			<MonthBar
				injectedData={loadedData && loadedData.months[month]}
				key={i}
				maxScrobbles={max}
				month={abbr}
				variant="dummy"
				year="2016"
			/>
		);
	};

	return (
		<React.Fragment>
			{months}
		</React.Fragment>	
	);
};

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
		if (loading) { // 1464764400 === June 01, 2016
			getStaticProps({ start: start ? start : '1464764400' }).then(data => {
				setData(data);
				setLoading(false);
			});
		}
	});
	
	return (
		<div className="lastfm-timeline">
			<div className="lastfm-timeline__graph">
				<DefaultMonthSet max={data.maxMonthly} loadedData={!loading && data} />
			</div>
		</div>
	)
};

export default LastFMTimeline;
