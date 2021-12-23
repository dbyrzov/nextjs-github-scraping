import Head from 'next/head';
import Home from '../components/home/home';


export default function MainIndex() {
  return (
    <div className="container">
      <Head>
        <title>First scraping app</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Home></Home>

      {/* <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style> */}
    </div>
  )
}
