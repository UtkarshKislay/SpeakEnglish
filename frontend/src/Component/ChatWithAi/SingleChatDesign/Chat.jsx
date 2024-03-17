import React from 'react'
import './Chat.css';
const Chat = (message) => {
    // console.log(message);
    const data = message.message;
    // console.log(data);
    return (
        <div className={`messageContainer 
        ${data.role === "user" ? "userMessage" : "aiMessage"}`}>
            {data.content}
        </div>
    )
}

export default Chat