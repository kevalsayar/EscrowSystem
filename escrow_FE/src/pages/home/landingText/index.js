import React from 'react';
import styles from './landingText.module.css'

const LandingText = () => {
   const { right_aside, upper_text, main_text, lower_text, text_container, text_main_container } = styles;
   return (
      <div className={text_main_container}>
         <aside className={right_aside}>
            <div className={`${upper_text} ${text_container}`}>Sell Digital Services Globally</div>
            <div className={`${main_text} ${text_container}`}>
               Accept Crypto Payments
               <br />without paying Hefty Commissions
            </div>
            <div className={`${lower_text} ${text_container}`}>Decentralised Escro, Subscription <br />Payment, Fiat On Ramp, Invoicing</div>
         </aside>
      </div>
   )
}

export default LandingText