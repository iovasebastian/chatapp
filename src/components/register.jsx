import { useState } from 'react';
import '../style/register.css';

const Register = () =>{
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
        const response = await fetch("https://chatapp-server-ghz3.onrender.com/register.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({name: name, password:password, email:email}),
          });
          const result = await response.json();
          if (result.status === "success") {
            console.log(result);
          } else {
            console.log(result);
          }
        } catch (error) {
          console.error(error);
        }
    }

    return(
        <div className="registerDiv">
            <form className="formLogin">
                <label>Email</label>
                <input className = "emailLogin" type = "text" placeholder = "Email..." value = {email} onChange = {(e) => setEmail(e.target.value)}/>
                <label>Password</label>
                <input className = "passwordLogin"type = "password" placeholder = "Password..." value = {password} onChange = {(e) => setPassword(e.target.value)}/>
                <label>Name</label>
                <input className = "emailLogin" type = "text" placeholder = "Name..." value = {name} onChange = {(e) => setName(e.target.value)}/>
                <button className = "buttonLogin" onClick={handleSubmit}>Register</button>
            </form>
        </div>
    )
}
export default Register;