import React from 'react'
import Header from './Components/Header'
import Hero from './Home/Hero'
import Footer from './Components/Footer'
import Benefit from './Home/BenefitSection'

const Home = () => {
  return (
    <div>
      <Header />
      <Hero />
      <Benefit />
      {/* <Footer /> */}
    </div>
  )
}

export default Home
