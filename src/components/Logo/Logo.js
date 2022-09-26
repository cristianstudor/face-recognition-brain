import React from "react";
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import brain from './brain100px.png'

const Logo = () => {
  return(
    <div className="ma4 mt0">
      <Tilt style={{width:'150px'}}>
        <div className="tilt br2 shadow-2 pa3" style={{height:'150px'}}>
          <img src={brain} alt="logo" style={{padding: '9px 0px'}}/>
        </div>
      </Tilt>
    </div>
  );
}

export default Logo;
