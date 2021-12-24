import Head from 'next/head';
import Home from '../components/home/home';


export default function MainIndex() {
  return (
    <div className="container">
      <Head>
        <title>Github scrape</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.13.0/css/all.css"></link>
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
