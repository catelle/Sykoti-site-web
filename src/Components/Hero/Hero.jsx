import React from 'react'
import './Hero.css'
import dark_arrow from '../../assets/dark-arrow.png'

const Hero = () => {
  return (
    <div className='hero container'>
      <div className="hero-text">
        <h1>Protégez-vous avec Audace et Envie</h1>
        <p>Nous concevons des solutions pour un usage sain de la technologie 
          et assistons les victimes de cybercrimes. Nos programmes aident les invividus à acquérir les compétences et valeurs pour un usage de la technologie au service de leur bien-être.
        </p>
        <button className='btn'>Voir plus <img src={dark_arrow} alt=""/></button>
      </div>
    </div>
  )
}

export default Hero