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

function SingleChat({fetchAgain , setFetchAgain}) {
  const {user , setSelectedChat, selectedChat} = ChatState()
  const [loading, setLoading] = useState(false);  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
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

  useEffect(() => {
    fetchAllMessages()
  }, [selectedChat]);

  const handelSendMessage = async (event) => {
    if(event.key === "Enter" && newMessage) {
      try {
         const config = {
                headers:{
                  "content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                }
        }
        
        setNewMessage("")
        const { data } = await axios.post("http://localhost:4000/api/message",{content : newMessage, chatId: selectedChat._id}, config);
        setMessages([...messages, data])
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
  }

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
