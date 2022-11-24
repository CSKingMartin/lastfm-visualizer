import Head from 'next/head'
import Image from 'next/image'

import LastFMTimeline from '../components/lastfm-timeline';

export default function Home() {
	return (
		<div>
			<LastFMTimeline />
		</div>
	)
}
