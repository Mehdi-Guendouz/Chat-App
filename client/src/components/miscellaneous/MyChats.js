import React, { useEffect, useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../../config/ChatLogic';
import GroupChatModel from './GroupChatModel';

const MyChats = ({fetchAgain}) => {
    const [loggedUser, setLoggedUser] = useState();
    const [chatloading, setChatloading] = useState(false);
    const {user , setSelectedChat, selectedChat, chats, setChats } = ChatState()
    const toast = useToast()

    const fetchChats = async () =>{
        setChatloading(true)
        try {
            const config = {
                headers:{
                    authorization: `Bearer ${user.token}`, 
                }
            }

            const { data } = await axios.get(`http://localhost:4000/api/chat`, config)
            setChatloading(false)
            setChats(data)
            // console.log(data)
        } catch (error) {
            toast({
                title: 'there is no chat available',
                description: "no chat",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })  
            setChatloading(false)
        }
    }

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem('userinfo')));
        fetchChats() 
    }, [fetchAgain]);


    return (
        <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg="white"
        w={{ base: "100%", md: "31%" }}
        borderRadius="lg"
        borderWidth="1px"
        >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
      
          
        <GroupChatModel>
            <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModel>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
