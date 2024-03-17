import React from 'react'
import './Card.css';
import { useNavigate } from 'react-router-dom';
const Card = (props) => {
    const {title,content,link}=props;
    const navigate = useNavigate();
  return (
    <div>
        <div className="cardPage">
            <div className="SubTitle">
              {title}
            </div>
            <div className="content">
              {content}
            </div>
            <div className="navigate">
              <button className='naigateBtn' onClick={()=>{navigate(link)}}>
                Start
              </button>
            </div>
        </div>
    </div>
  )
}

export default Card