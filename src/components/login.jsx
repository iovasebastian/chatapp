import '../style/login.css';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
const Login = () =>{
    const navigate = useNavigate();
    const [formData, setFormData] = useState({email: "", password: ""});
    const [message, setMessage] = useState("");
    const navigateMain = () =>{
        navigate('/main');
    }
    const navigateRegister = (e) =>{
      e.preventDefault();
      navigate('/register');
  }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value })); // Update state properly
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const response = await fetch("http://localhost:8000/index.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
    
          const result = await response.json();
          if (result.status === "success") {
            setMessage(`Welcome, ${result.user.name}!`);
            localStorage.setItem("user", JSON.stringify(result.user));
            navigateMain();
          } else if(result.status === "error"){
            alert("Email or password are wrong. Please try again!");
            setMessage(result.message);
          }else{
            alert("Wait one minute");
          }
        } catch (error) {
          setMessage("Error connecting to server.");
          console.error(error);
        }
      };
return(
    <div className="divLogin">
        <form className = "formLogin" onSubmit={handleSubmit}>
        <label>Email</label>
        <input className = "emailLogin" type = "email" placeholder = "Email..."name = "email" value = {formData.email} onChange={handleChange}></input> 
        <label>Password</label>
        <input className = "passwordLogin" type = "password" placeholder = "Password..." name = "password" value = {formData.password} onChange={handleChange}></input>
        <button className = "buttonLogin" type = "submit">Submit</button>
        <button className = "buttonLogin" onClick={navigateRegister}>Register</button>
        </form>
    </div>
)
}
export default Login;