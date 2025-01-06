import { useState } from "react";
import '../style/message.css';
const Message = (props) =>{
    const[sender, setSender] = useState(props.sender);
    return(
        <div className={sender?"messageDivSender":"messageDivReceiver"}>
              <p className="messageP">{props.messageBody}</p>
        </div>
    )
}
export default Message;