import React, { useState } from 'react'
import NavBar from './Components/Navbar/Navbar'
import Hero from './Components/Hero/Hero'
import Programs from './Components/Programs/Programs'
import Title from './Components/Title/Title'
import About from './Components/About/About'
import Campus from './Components/Campus/Campus'
import Testimonials from './Components/Testimonials/Testimonials'
import Contact from './Components/Contact/Contact'
import Footer from './Components/Footer/Footer'
import Videoplayer from './Components/Videoplayer/Videoplayer'

const App = () => {

  const[playState,setPlayState]= useState(false);
  return (
    <div>
      <NavBar />
      <Hero />
      <Title subTitle='Nos PROGRAMMES' title='Nous avons des activités pour'/>
      <div className='container'>
      <Programs />
      <About setPlayState={setPlayState}/>
      <Title subTitle='Gallery' title='Extrait de nos activités'/>
      <Campus/>
      <Title subTitle='TÉMOIGNAGES' title='Retour de nos clients'/>
      <Testimonials/>
      <Title subTitle='Contact' title='Nous contacter'/>
      <Contact/>
      <Footer/>
      </div>

     <Videoplayer playState={playState} setPlayState={setPlayState}/>
    </div>
  )
}

export default App
