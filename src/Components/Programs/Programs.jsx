import React from 'react'
import './Programs.css'
import program_1 from '../../assets/program-1.jpg'
import program_2 from '../../assets/program-2.jpg'
import program_3 from '../../assets/program-3.jpg'
import program_icon1 from '../../assets/program-icon-1.png'
import program_icon2 from '../../assets/program-icon-2.png'
import program_icon3 from '../../assets/program-icon-3.png'

const Programs = () => {
  return (
    <div className='programs'>
      <div className='program'>
       <img src={program_1} alt=""/>
       <div className='caption'>
        <img src={program_icon1} alt="" />
        <p>Ateliers Famille Sécurisée</p>
       </div>
      </div>
      <div className='program'>
        <img src={program_2} alt="Program 2 Icon" />
        <div className='caption'>
        <img src={program_icon2} alt="" />
        <p>Jeunes Connectés</p>
       </div>
      </div>
      <div className='program'>
        <img src={program_3} alt="Program 3 Icon" />
        <div className='caption'>
        <img src={program_icon3} alt="" />
        <p>Cyberambassador</p>
       </div>
      </div>
    </div>
  )
}

export default Programs
