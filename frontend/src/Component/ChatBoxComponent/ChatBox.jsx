import React from 'react'
import { useRef } from 'react';
import SingleChatBox from './SingleChatBox';
import { useEffect } from 'react';
import './ChatBox.css';
const ChatBox = ({data,load}) => {
  const chatBoxRef = useRef(null);
  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [data]);
  return (
  
    <div className='ChatBox'>
      <div className="chats" ref={chatBoxRef}>
       {data.map((chatItem)=>{
           return <SingleChatBox chat={chatItem} key={chatItem.uniqueId} />
        })
       }
       {(load===1)?<div style={{marginRight:"60%",marginLeft:"5px",width:'inherit'}}>Typing...</div>:null}

      </div>
        </div>
  )
}

export default ChatBox