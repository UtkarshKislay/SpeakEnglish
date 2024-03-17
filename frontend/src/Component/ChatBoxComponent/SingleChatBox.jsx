import React from 'react'
import './SingleChatBox.css';
const SingleChatBox = ({chat}) => {
  // console.log(chat);
  const isUser=(chat.senderAdd==='User')?1:0;
  const date = new Date(chat.createdAt).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
  // console.log(date);
  return (
    <div className={`SingleChatBox ${isUser ? 'alignLeft' : 'alignRight'}`}>
        <div className="message" style={{color:(isUser)?"blue":"black"}}>{chat.message}</div>
        <div className='createdAt'>{date}</div>
    </div>
  )
}

export default SingleChatBox