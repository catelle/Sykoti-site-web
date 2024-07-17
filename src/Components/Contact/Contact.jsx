import React from 'react'
import './Contact.css'
import msg_icon from '../../assets/msg-icon.png'
import mail_icon from '../../assets/mail-icon.png'
import phone_icon from '../../assets/phone-icon.png'
import location_icon from '../../assets/location-icon.png'
import white_arrow from '../../assets/white-arrow.png'
const Contact = () => {

    const [result, setResult] = React.useState("");

    const onSubmit = async (event) => {
      event.preventDefault();
      setResult("Sending....");
      const formData = new FormData(event.target);
  
      formData.append("access_key", "cd964ce3-902f-46a1-b960-091a9a83a51f");
  
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
  
      const data = await response.json();
  
      if (data.success) {
        setResult("Form Submitted Successfully");
        event.target.reset();
      } else {
        console.log("Error", data);
        setResult(data.message);
      }
    };

  return (
    <div className="contact">
        <div className="contact-col">
            <h3>Nous contacter <img src={msg_icon} alt="" /></h3>
            <p>N'hésitez pas à nous contacter via le formulaire de contact ou nos coordonnées ci-dessous. Vos commentaires, questions et suggestions sont importants 
            alors que nous nous efforçons de fournir un service exceptionnel à notre communauté.
            </p>
            <ul>
                <li><img src={mail_icon} alt="" />contactsykoti@gmail.com</li>
                <li><img src={phone_icon} alt="" />+237657273247</li>
                <li><img src={location_icon} alt="" />Rue 2090, Ndogbon, Douala,<br/>Cameroun</li>
            </ul>

        </div>
        <div className="contact-col">
            <form onSubmit={onSubmit} >
                <label >Votre nom</label>
                <input type="text" name='name' placeholder='Entrez votre nom' required />
                <label>Numéro de téléphone</label>
                <input type="text" name='phone' placeholder='Entrez votre numéro de téléphone' required />
                <label>Écrivez votre message ici</label>
                <textarea name=""  rows="6" placeholder='Entrer votre message ici' required></textarea>
                <button type='submit' className='btn dark-btn' >Envoyer <img src={white_arrow} alt="" /></button>
            </form>
            <span>{result}</span>
        </div>
    </div>
  )
}

export default Contact