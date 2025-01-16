import '../style/main.css';
import Message from './message';
import Chatline from './chatline';
import { useEffect, useState, useRef } from 'react';
const Main = () =>{
    const messageEndRef = useRef(null);
    const user = JSON.parse(localStorage.getItem("user"));
    const [friendEmail, setFriendEmail] = useState("");
    const [friends, setFriends] = useState([]);
    const [chatselected, setChatSelected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [typingMessage, setTypingMessage] = useState("");
    const inputRef = useRef(null);
    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/addfriends.php", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({friendEmail: friendEmail,userId: user.id}),
            });
            const result = await response.json();
            if (result.status === "success") {
                console.log(friends);
                window.location.reload();
            } else {
                alert("User was not found");
                console.log("user not found");
            }
            console.log(result);
            
        }catch(e){
            alert("Something went wrong!");
            console.error(e);
        }
    }
    async function fetchFriends() {
        try {
          const response = await fetch("http://localhost:8000/getfriends.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id }),
          });
          const data = await response.json();
          setFriends(data.friends || []); 
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
    }
    const fetchMessages = async (friendshipId) => {
        try {  
          if(friendshipId!='undefined'){
            const response = await fetch("http://localhost:8000/getmessages.php", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ chatId: friendshipId }),
            });
          
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
        
            if (data.status === "success") {
              setChatSelected(true);  
              setMessages(data.messages || []);
            } else {
              console.error("Error from server:", data.message);
            }
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

const sendMessage = async () =>{
    const chatId = localStorage.getItem('chatId');
        try {   
          if(typingMessage.trim()){  
            const response = await fetch("http://localhost:8000/sendmessage.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messageToSend: typingMessage, chatId: chatId, senderId: user.id }),
            });
          
            const data = await response.json();
            if (data.status === "success") {
              fetchMessages(chatId);
              console.log(messages);
              setTypingMessage("");
            } else {
              console.error("Error from server:", data.message);
            }
          }
        } catch (error) {
        console.error("Error sending message:",typingMessage,user.id, error);
        }
}
const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
};
const setId = (friendshipId) =>{
    localStorage.setItem('chatId', friendshipId);
}
const handleKeyDown = (e) => {
  if (e.key === "Enter") { 
      e.preventDefault(); 
      sendMessage();
  }
};
useEffect(() => {
    scrollToBottom();
}, [messages]);
useEffect(() => {
    fetchFriends();
},[]);
useEffect(() => {
    localStorage.setItem('chatId', undefined);
},[]);
useEffect(() => {
  if (chatselected && inputRef.current) {
    inputRef.current.focus();
  }
}, [chatselected]);
useEffect(() => {
    const interval = setInterval(() => {
    const chatIdForFetch = localStorage.getItem('chatId');
    fetchMessages(chatIdForFetch);
    }, 3000);
    return () => clearInterval(interval);
}, []);
    return(
        <div className="divGeneralMain">
            <div className="divCentralMain">
                <div className="chatLeftSide">
                    <div className='friendDiv'>
                    {friends.map((friend, index) => (
                        <div
                        key={index}
                        onClick={() => {fetchMessages(friend.friendship_id); setId(friend.friendship_id)}} 
                        className="chatlineDiv"
                      >
                        <Chatline
                          name={friend.name}
                          friendshipId={friend.friendship_id}
                          lastMessage={friend.lastMessage || "No messages yet"} 
                        />
                      </div>
                    ))}
                    </div>
                    <div className='addFriendDiv'>
                        <h2 className='h2AddFriend'>Add a friend</h2>
                        <input type = "text" placeholder = "Friend email..."onChange={(e) => setFriendEmail(e.target.value)}/>
                        <button onClick={handleSubmit}>Send</button>
                    </div>
                </div>
                <div className="chatRightSide">
                    {!chatselected && <h1 className='messageNoChatSelected'>Select a chat</h1>}
                    <div className="messageSpace">
                        {messages == '' && chatselected && <h1 className='messageNoChatSelected'>No messagees yet! Start Chatting</h1>}
                        {messages.map((message, index) => (
                            <Message 
                            messageBody = {message.body}
                            sender = {message.senderId==user.id?true:false}
                            />
                        ))}
                        <div ref={messageEndRef} />
                    </div>
                    {chatselected&&<div className="messageInputDiv">
                        <input className = "inputMessage" ref = {inputRef} value = {typingMessage} type = "text" placeholder='Message...' onChange={(e) => setTypingMessage(e.target.value)} onKeyDown={handleKeyDown}/>
                        <button className= "buttonSend" onClick={sendMessage}>Send</button>
                    </div>}
                </div>
            </div>
        </div>
    )
}
export default Main