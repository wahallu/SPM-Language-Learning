import React from 'react'
import Header from './Components/layout/Header'
import Hero from './Home/Hero'
import Footer from './Components/layout/Footer'
import Benefit from './Home/BenefitSection'
import Getstart from './Home/Getstart'

const Home = () => {
  return (
    <div>
      <Header />
      <Hero />
      <Benefit />
      <Getstart />
      {/* <Footer /> */}
    </div>
  )
}

export default Home
