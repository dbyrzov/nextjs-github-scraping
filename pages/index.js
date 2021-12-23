import Head from 'next/head';
import Home from '../components/home/home';


export default function MainIndex() {
  return (
    <div className="container">
      <Head>
        <title>Github scrape</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Home></Home>

      <style jsx>{`
        .container {
          height: 100%;
        }
      `}</style>
    </div>
  )
}
