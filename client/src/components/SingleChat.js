import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../config/ChatLogic'
import ProfileModel from './miscellaneous/ProfileModel'
import UpdateGroupChat from './miscellaneous/UpdateGroupChat'
import axios from 'axios'
import './styles.css'
import ScrollableGroupChat from './ScrollableGroupChat'
import io from "socket.io-client"
import Lottie from 'react-lottie';
import * as animationData from "../animation/77160-typing.json"


const ENDPOINT = 'http://localhost:4000'
let socket , selectedChatCompare


    const defaultOptions = {
      loop: true,
      autoplay: true, 
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };


function SingleChat({fetchAgain , setFetchAgain}) {


  const {user , setSelectedChat, selectedChat ,  notifications, setNotifications} = ChatState()
  const [loading, setLoading] = useState(false);  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setsocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast()

  

  const fetchAllMessages = async () => {
    if(!selectedChat) return
    try {
      setLoading(true)
      const config = {
        headers:{
          Authorization: `Bearer ${user.token}`,
        }
      }

      const { data } = await axios.get(`http://localhost:4000/api/message/${selectedChat._id}`, config)
      setMessages(data)
      setLoading(false)
      socket.emit('join chat', selectedChat)
    } catch (error) {
       toast({
                title: 'error',
                description: "an error occurred while fetching messages try again",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })  
      setLoading(false)
    }

  }

  const handelSendMessage = async (event) => {
    if(event.key === "Enter" && newMessage) {
      try {
        socket.emit("notTyping", selectedChat)
         const config = {
                headers:{
                  "content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                }
        }
        
        setNewMessage("")
        const { data } = await axios.post("http://localhost:4000/api/message",{content : newMessage, chatId: selectedChat._id}, config);
        setMessages([...messages, data])
        socket.emit("new message", data)
        console.log(data);
      } catch (error) {
         toast({
                title: 'error',
                description: "an error occurred try again",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })  
      }
    }
  }

  const typingHandler = (e) => {
    setNewMessage(e.target.value)

    if(!socketConnected) return

    if(!typing){
      setTyping(true)
      socket.emit("typing", selectedChat)
    }

    let date = new Date().getTime()
    let waitingTime =  3000
    setTimeout(() => {
      let dateNow = new Date().getTime()
      let diff = dateNow - date
      
      if(diff >= waitingTime && typing) {
        socket.emit("notTyping" , selectedChat)
        setTyping(false)
      }
      
    }, waitingTime);

  }

  // useEffects handlers

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user)
    socket.on("connected", () => setsocketConnected(true) )
    socket.on("someone typing",  () => {
      setIsTyping(true)
    })
    socket.on("stop typing",  () => {
      setIsTyping(false)
    })
  }, []);

  useEffect(() => {
    fetchAllMessages()

    selectedChatCompare = selectedChat
    
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", newMessageReceived => {
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id){
        if(!notifications.includes(newMessageReceived)){
          setNotifications([...notifications, newMessageReceived]);
          setFetchAgain(prev => !prev)
        }
      }else{
        setMessages([...messages, newMessageReceived]);
      }
    })
    
  });

// console.log(notifications)
  

  return (
    <>
      {selectedChat ?
        (
        <>
            <Text
                fontSize={{ base: "28px", md: "30px" }}
                pb={3}
                px={2}
                w="100%"
                fontFamily="Work sans"
                display="flex"
                justifyContent={{ base: "space-between" }}
                alignItems="center"
            >
                <IconButton
                    display={{ base: "flex", md: "none" }}
                    icon={<ArrowBackIcon />}
                    onClick={() => setSelectedChat("")}
                />
                {selectedChat?.isGroupChat ? (
                  <>
                    {selectedChat.chatName.toUpperCase()}
                    <UpdateGroupChat setFetchAgain={setFetchAgain} fetchAllMessages={fetchAllMessages} />
                  </>
                ) : (
                  <>
                    {getSender(user, selectedChat.users).toUpperCase()}
                    <ProfileModel user={getSenderFull(user, selectedChat.users)} />
                  </>
                )}
            </Text>
            <Box  
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
            >
              {loading ? <Spinner size={'xl'} width={20} height={20} alignSelf={'center'} margin={'auto'} /> : (
                <>
                  <Box overflowY={"scroll"} display={"flex"} flex={"column"} className='messages' w="100%">
                    <ScrollableGroupChat messages={messages} />
                  </Box>
                </>
              )}
              {isTyping ? <div>
                <Lottie 
                  options={defaultOptions}
                  width={70}
                  style={{ marginBottom: 15, marginLeft: 0 }}
                />
              </div> : <></>}
            </Box>
            <FormControl onKeyDown={handelSendMessage} isRequired mt={3}>
              
              <Input 
                onChange={typingHandler}
                placeholder='your message'
                value={newMessage}
                bg={"#e0e0e0"}
                variant={"filled"}
              />
            </FormControl>
        </>
        )
      : (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      ) }
    </>
  )
}

export default SingleChat
