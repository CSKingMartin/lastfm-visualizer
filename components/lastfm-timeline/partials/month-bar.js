import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useEffect, useState } from 'react';

const client = new ApolloClient({
 	uri: '/api/graphql/',
 	cache: new InMemoryCache()
});

async function getStaticProps(args) {
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
		variant,
		year,
		children,
		...rest
	} = props;

	const [data, setData] = useState(injectedData ? injectedData : {});
	const [loading, setLoading] = useState(injectedData === false);
	const [barHeight, setBar] = useState('2%');
	
	useEffect(() => {
		if (loading && variant !==  'dummy') {
			getStaticProps({ month, year }).then(data => {
				setData(data);
				setLoading(false);
				setBar(`${(data.count / maxScrobbles) * 100}%`);
			}).catch((error) => {
				console.log(error.message);
			});
		} else if (loading && injectedData !== false) {
			setData(injectedData);
			setLoading(false);
			setBar(`${(injectedData.count / maxScrobbles) * 100}%`);
		}
	});

	const barBackgroundClass = [
		'lastfm-timeline__graph-bar-background',
		!loading ? 'is-loaded' : ''
	].join(' ').trim();
	
	const barBackgroundStyle = {
		height: `${(data.count / maxScrobbles) * 100}%`
	};
	
	return (
		<div className="lastfm-timeline__graph-bar" {...rest}>
			<span
				className={barBackgroundClass}
				style={{height: barHeight}}
			/>
			{!loading &&
				<div className="lastfm-timeline__bar-label">{month || data.month} {year || data.year}</div>
			}
		</div>
	);
};

export default MonthBar;
