import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css';

import LastFMTimeline from '../components/lastfm-timeline';

export default function Home() {
  return (
    <div className={styles.container}>
      <LastFMTimeline />
    </div>
  )
}
