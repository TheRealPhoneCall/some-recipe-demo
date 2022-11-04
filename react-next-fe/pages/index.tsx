import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Footer from '../layouts/Footer'
import Header from '../layouts/Header'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Some Recipe App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header/>

      <main className="">
        {/* Page Component */}
      </main>

      <Footer />
    </div>
  )
}

export default Home
