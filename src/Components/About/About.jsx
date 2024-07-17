import React from 'react'
import './About.css'
import about_img from '../../assets/about.png'
import play_icon from '../../assets/play-icon.png'
const About = ({setPlayState}) => {
  return (
    <div className='about'>
        <div className="about-left">
            <img src={about_img} alt="" className='about-img'/>
            <img src={play_icon} alt="" className='play-icon' onClick={()=>{setPlayState(true)}}/>
            
        </div>
        <div className="about-right">
            <h3>ABOUT Sykoti</h3>
            <h2>Éduquer pour un Usage Technologique Prudent et Responsable</h2>
            <p>Rejoignez une aventure éducative transformative avec Sykoti E-awareness
                 Center et découvrez nos programmes éducatifs complets. Notre curriculum 
                 à la pointe est conçu pour doter les individus des connaissances, compétences 
                 et expériences nécessaires pour exceller dans l'utilisation responsable de la
                  technologie.</p>
            <p>Nous nous distinguons par nos ateliers de formation familiale interactifs, nos 
                documents adaptés aux besoins individuels et nos outils numériques innovants, 
                notamment une application et une plateforme numérique. Notre approche inclut 
                également l'innovation, l'apprentissage pratique et le mentorat personnalisé,
                 préparant ainsi les participants à avoir un impact significatif dans leurs foyers, 
                 communautés et environnements numériques. 
            </p>
            <p>Nous aidons les individus à tirer parti du meilleur de la technologie pour leur bien-être,
              tout en offrant une assistance aux victimes de cybercrimes. Que vous souhaitiez adopter une
               utilisation responsable de la technologie, développer des compétences numériques ou en prévenir
               l'addiction aux jeux en ligne, notre large éventail de programmes offre la voie idéale pour 
               atteindre ces objectifs.
            </p>
        </div>
    </div>
  )
}

export default About