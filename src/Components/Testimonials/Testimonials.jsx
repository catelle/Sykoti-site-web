import React, { useRef } from 'react'
import './Testimonials.css'
import next_icon from '../../assets/next-icon.png'
import back_icon from '../../assets/back-icon.png'
import user1 from '../../assets/user-1.png'
import user2 from '../../assets/user-2.jpg'
import user3 from '../../assets/user-3.jpg'
import user4 from '../../assets/user-4.png'
const Testimonials = () => {

    const slider= useRef();
    let tx=0;

const slideForward=()=>{
if(tx > -50){
    tx -=25;
}
slider.current.style.transform=`translateX(${tx}%)`
   
}
const slideBackward=()=>{

    if(tx < 0){
        tx +=25;
    }
    slider.current.style.transform=`translateX(${tx}%)`

    
}


  return (
    <div className='testimonials'>
        <img src={next_icon} alt="" className='next-btn' onClick={slideForward}/>
        <img src={back_icon} alt="" className='back-btn' onClick={slideBackward}/>
        <div className="slider">
            <ul ref={slider}>
                <li>
                    <div className="slide">
                        <div className="user-info">
                            <img src={user1} alt="" />
                            <div>
                                <h3>
                                    Carine MADZON
                                </h3>
                                <span>
                                    Yaounde,Cameroon
                                </span>
                            </div>
                        </div>
                        <p>
                        Grâce aux ateliers interactifs et à l'accompagnement personnalisé de Sykoti E-awareness Center, 
                        ma famille a appris à naviguer en toute sécurité dans le monde numérique. Les outils numériques 
                        comme l'application nous ont permis de renforcer notre sécurité en ligne tout en favorisant une 
                        utilisation responsable de la technologie. Je recommande vivement leurs programmes pour toute 
                        famille soucieuse de son bien-être numérique.
                        </p>
                    </div>
                </li>
                <li>
                    <div className="slide">
                        <div className="user-info">
                            <img src={user2} alt="" />
                            <div>
                                <h3>
                                    Elvis Abanda
                                </h3>
                                <span>
                                    Douala,Cameroun
                                </span>
                            </div>
                        </div>
                        <p>
                        En tant que victime de cybercrime, j'ai trouvé un soutien précieux et 
                        des ressources essentielles chez Sykoti E-awareness Center. Leur équipe 
                        m'a guidé à travers les étapes de récupération et m'a aidé à renforcer ma 
                        sécurité en ligne. Leur engagement envers la sécurité numérique et le bien-être 
                        des individus est vraiment remarquable.
                        </p>
                    </div>
                </li>
                <li>
                    <div className="slide">
                        <div className="user-info">
                            <img src={user3} alt="" />
                            <div>
                                <h3>
                                    Delphine Masso
                                </h3>
                                <span>
                                    Yaounde,Cameroun
                                </span>
                            </div>
                        </div>
                        <p>
                        Les cours d'alphabétisation numérique pour adolescents de Sykoti E-awareness Center
                         ont transformé la façon dont mes enfants interagissent avec la technologie. Ils ont 
                         développé des compétences numériques essentielles tout en apprenant l'importance d'une 
                         utilisation responsable des médias sociaux. Ces programmes sont essentiels pour préparer
                          la prochaine génération à un avenir numérique sûr et éclairé.
                        </p>
                    </div>
                </li>
                <li>
                    <div className="slide">
                        <div className="user-info">
                            <img src={user4} alt="" />
                            <div>
                                <h3>
                                    Willy
                                </h3>
                                <span>
                                Montreuil,France
                                </span>
                            </div>
                        </div>
                        <p>
                        Sykoti E-awareness Center a été un véritable soutien dans mon combat 
                        contre l'addiction aux paris sportifs. Leur programme de cyberdiscipline 
                        m'a appris à gérer mes habitudes en ligne de manière responsable et éthique. 
                        Grâce à leur accompagnement personnalisé et à leurs ressources éducatives,
                         j'ai retrouvé le contrôle de ma vie numérique et je suis désormais capable 
                         de prendre des décisions éclairées. Je recommande chaudement leurs services
                          à tous ceux qui cherchent à surmonter les défis liés à l'addiction aux 
                          investissement a risque en ligne.
                        </p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
  )
}

export default Testimonials