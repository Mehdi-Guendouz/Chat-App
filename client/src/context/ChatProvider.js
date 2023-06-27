import react,  { createContext, useContext, useEffect, useState,  } from 'react';
import { useNavigate } from 'react-router-dom';


const ChatContext = createContext()



const ChatProvider = ({children}) =>{
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate()


    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userinfo'));
        setUser(user)
        if(!user){
            navigate("/")
        }
        // console.log(user)
    }, [navigate]);

    return (
        <ChatContext.Provider value={ {user , setSelectedChat, setUser, selectedChat, chats, setChats, notifications, setNotifications}}>
            {children}
        </ChatContext.Provider>
    )
}


export const ChatState =() =>{
    return useContext(ChatContext)
}

export default ChatProvider