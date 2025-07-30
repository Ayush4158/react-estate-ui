import {  Link,  useNavigate } from "react-router-dom";
import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import apiRequest from "../../lib/apiRequest";
import "./profilePage.scss";
import { AuthContext } from "../../context/AuthContext";
import { Suspense, useContext, useEffect, useState} from "react";

function ProfilePage() {
  const[userData, setUserData] = useState([]);
  const[saveData, setSaveData] = useState([]);
  const [chat , setChat] = useState([]);
  
  const navigate = useNavigate()
  const {updateUser, currentUser} = useContext(AuthContext);
  const handleLogout = async() => {
    try {
      const res = await apiRequest.post('/auth/logout')
      if(res.status === 200){
        updateUser(null);
        navigate("/")
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const getList = async() => {
      try {
        const response = await apiRequest.get('/user/profilePost');
        if(response.status === 200){
          // console.log(response)
          setSaveData(response.data.savedPost)
          setUserData(response.data.userPost)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getList();
    
  }, [])
  useEffect(() => {
    const getChat = async() => {
      try {
        const response = await apiRequest.get('/chat');
        if(response.status === 200){
          setChat(response.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getChat();
    
  }, [])

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <Link to="/profile/update">
              <button>Update Profile</button>
            </Link>
            
          </div>
          <div className="info">
            <span>
              Avatar:
              <img
                src={currentUser.avatar || "/noavatar.jpeg"}
              />
            </span>
            <span>
              Username: <b>{currentUser.username}</b>
            </span>
            <span>
              E-mail: <b>{currentUser.email}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <div className="title">
            <h1>My List</h1>
            <Link to="/add"><button>Create New Post</button></Link>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
          <List posts={userData} />
          </Suspense>
          <div className="title">
            <h1>Saved List</h1>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
          <List posts={saveData} />
          </Suspense>
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
          <Suspense fallback = {<p>Loading...</p>}>
          <Chat chats={chat}/>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
