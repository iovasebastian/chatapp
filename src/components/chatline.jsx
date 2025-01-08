import { useEffect, useState } from 'react';
import '../style/chatline.css';
const Chatline = (props) =>{
    const friendshipId = props.friendshipId;
    const [lastMessage, setLastMessage] = useState("");
    const handleMessages = () =>{      
        localStorage.setItem("chatId", friendshipId);
    } 
    const handleDelete = async () =>{
        try{
            const response = await fetch("https://chatapp-server-ghz3.onrender.com/deletefriendship.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({friendshipId : friendshipId}),
              });
              const result = await response.json();
              if (result.status === "success") {
                console.log(result);
                window.location.reload();
              } else {
                alert("Friendship was not deleted");
                console.log(result);
              }
            } catch (error) {
              console.error(error);
            }
    }
    const fetchMessages = async (friendshipId) => {
      try {  
        if(friendshipId!='undefined'){
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
            setLastMessage(data.messages[data.messages.length-1].body || []);
            console.log('last message', data.messages[data.messages.length-1].body);
            console.log('messages',data.messages)
          } else {
            console.error("Error from server:", data.message);
          }
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    useEffect(()=>{
      fetchMessages(friendshipId);
    },[])

    return(
        <div className="divChatLine" onClick={handleMessages}>
            <h3>{props.name}</h3>
            <p>{lastMessage || "No messages yet"}</p>
            <button onClick={handleDelete}>Delete friendship</button>
        </div>
    )
}
export default Chatline;