import { useContext, useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest"
import { AuthContext } from "../../context/AuthContext";

function Login() {

  const [error, setError] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const navigate =useNavigate();

  const {updateUser} = useContext(AuthContext)

  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsLoading(true)
    const formData = new FormData(e.target);
    const username = formData.get("username")
    const password = formData.get("password")

    // console.log(username, email, password)
    try {
      const response = await apiRequest.post("/auth/login", {username, password})
      // navigate("/login")
      if(response.status === 200){
        updateUser(response.data.userInfo);
        navigate('/')
      }
    } catch (error) {
      console.log(error);
      setError(error.response.message)
      console.log(error)
    } finally{
      setIsLoading(false);
    }
  }

  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input name="username" required minLength={3} maxLength={20} type="text" placeholder="Username" />
          <input name="password" type="password" placeholder="Password" />
          <button disabled={isloading}>Login</button>
          {error && <span>{error}</span>}
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;
