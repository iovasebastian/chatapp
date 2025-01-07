import '../style/main.css';
import Message from './message';
import Chatline from './chatline';
import { useEffect, useState, useRef } from 'react';
const Main = () =>{
  const messageEndRef = useRef(null);
    const chatId = localStorage.getItem('chatId');
    const user = JSON.parse(localStorage.getItem("user"));
    const [friendEmail, setFriendEmail] = useState("");
    const [friends, setFriends] = useState([]);
    const [chatselected, setChatSelected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [typingMessage, setTypingMessage] = useState("");
    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            const response = await fetch("https://chatapp-server-ghz3.onrender.com/addfriends.php", {
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
          const response = await fetch("https://chatapp-server-ghz3.onrender.com/getfriends.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id }),
          });
          const data = await response.json(); // Parse the response as JSON
          setFriends(data.friends || []); // Update the state with friends list
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
    }
    const fetchMessages = async (friendshipId) => {
        try {  

          const response = await fetch("https://chatapp-server-ghz3.onrender.com/getmessages.php", {
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
            setMessages(data.messages || []); // Update messages
            console.log('DATEEE',data.messages)
          } else {
            console.error("Error from server:", data.message);
          }
      
          console.log("Fetched messages:", data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

    const sendMessage = async () =>{
        const chatId = localStorage.getItem('chatId');
        try {  
            const response = await fetch("https://chatapp-server-ghz3.onrender.com/sendmessage.php", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ messageToSend: typingMessage, chatId: chatId, senderId: user.id }),
            });
        
            const data = await response.json();
            if (data.status === "success") {
              fetchMessages(chatId);
              setTypingMessage("");
            } else {
              console.error("Error from server:", data.message);
            }
          } catch (error) {
            console.error("Error sending message:",typingMessage,user.id, error);
          }
    }
    const scrollToBottom = () => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
    useEffect(() => {
      scrollToBottom();
  }, [messages]);
    useEffect(() => {
        fetchFriends();
    },[]);
    //useEffect(() => {
      //  fetchMessages();
    //},[chatId]);
    useEffect(() => {
      
      fetchMessages(); // Fetch messages initially
      const interval = setInterval(fetchMessages, 3000); // Fetch every 3 seconds
      return () => clearInterval(interval); // Cleanup on unmount
  }, [chatId]); // Re-run if chatId changes
    return(
        <div className="divGeneralMain">
            <div className="divCentralMain">
                <div className="chatLeftSide">
                    <div onClick = {fetchMessages}className='friendDiv'>
                    {friends.map((friend, index) => (
                        <div
                        key={index}
                        onClick={() => fetchMessages(friend.friendship_id)} // Pass friendshipId
                        className="chatlineDiv"
                      >
                        <Chatline
                          name={friend.name}
                          friendshipId={friend.friendship_id} // Pass friendshipId
                          lastMessage={friend.lastMessage || "No messages yet"} // Default message
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
                        <input className = "inputMessage" value = {typingMessage} type = "text" placeholder='Message...' onChange={(e) => setTypingMessage(e.target.value)}/>
                        <button className= "buttonSend" onClick={sendMessage}>Send</button>
                    </div>}
                </div>
            </div>
        </div>
    )
}
export default Main