import '../style/chatline.css';
const Chatline = (props) =>{
    const friendshipId = props.friendshipId;
    const handleMessages = () =>{
        
        localStorage.setItem("chatId", friendshipId);
    } 
    const handleDelete = async () =>{
        try{
            const response = await fetch("http://localhost:8000/deletefriendship.php", {
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
    return(
        <div className="divChatLine" onClick={handleMessages}>
            <h3>{props.name}</h3>
            <p>{props.lastMessage}</p>
            <button onClick={handleDelete}>Delete friendship</button>
        </div>
    )
}
export default Chatline;