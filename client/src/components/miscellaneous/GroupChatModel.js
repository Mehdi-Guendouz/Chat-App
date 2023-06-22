import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';
import UserListItem from '../userAvatar/UserListItem';
import UserBadgeItem from '../userAvatar/UserBadgeItem';

const GroupChatModel = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupName, setGroupName] = useState('');
    const [groupMembers, setGroupMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    const toast = useToast()

    const {user , chats , setChats} = ChatState()

    const handelSearch = async (query) => {
        setSearch(query)
        if(!query) return
        try {
            setLoading(true)
            const config = {
                headers:{
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.get(`http://localhost:4000/api/user?search=${search}`, config)
            console.log(data)
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast({
                title: 'there is no user with that name',
                description: "no user",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })  
            setLoading(false)
            console.log(error)
        }
    }

    const handelSubmit = async () => {
        if(!groupName || groupMembers.length < 1){
            toast({
                title: 'Please fill all the required fields',
                description: "warning",
                status: 'warning',
                duration: 9000,
                isClosable: true,
            })  
            return
        }
        try {
            setLoading(true)
            const config = {
                headers:{
                    'content-type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.post("http://localhost:4000/api/chat/group",{name: groupName , users: JSON.stringify(groupMembers.map(u => u._id))}, config )
            console.log(data)
            setChats([data, ...chats])
            setLoading(false)
            toast({
                title: 'The Chat has been created successfully',
                description: "successfully",
                status: 'success',
                duration: 9000,
                isClosable: true,
            })  
            onClose()
        } catch (error) {
            toast({
                title: 'there is something wrong please try again',
                description: "error",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })  
            setLoading(false)
            console.log(error)
        }
    }

    const handelGroup = (addUser) => {
        if(groupMembers.includes(addUser)){
            toast({
                title: 'user already added',
                description: "warning",
                status: 'warning',
                duration: 9000,
                isClosable: true,
            })
            return 
        }
        setGroupMembers([...groupMembers, addUser])
        
    }

    const handelDelete = (deleteUser) => {
        groupMembers.pop(deleteUser)
        setGroupMembers([...groupMembers])
        console.log(groupMembers)
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent >
            <ModalHeader
                fontSize="40px"
                fontFamily="Work sans"
                display="flex"
                justifyContent="center"
            >
                Create Group Chat
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody
                display="flex"
                flexDir="column"
                alignItems="center"
                justifyContent="space-between"
            >
                <FormControl>
                    <Input placeholder='Set a Group Name' onChange={(e) => setGroupName(e.target.value)} mb={1}/>
                </FormControl>
                <FormControl>
                    <Input placeholder='Search A User Name' onChange={(e) => handelSearch(e.target.value)} mb={1}/>
                </FormControl>
                <Box display='flex' w={'100%'} flexWrap={'wrap'}>
                    {groupMembers?.map(member =>(
                        <UserBadgeItem key={member._id} user={member} handleFunction={() => handelDelete(member)} />
                    ))}
                </Box>
                {loading ? <div>Loading.....</div> : (
                    searchResult?.slice(0,4).map((user) =>(
                        <UserListItem key={user._id} user={user} handleFunction={() => handelGroup(user)} />
                    ))
                )}
            </ModalBody>
            <ModalFooter>
                <Button onClick={handelSubmit} colorScheme={'blue'} >Create Group</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    );
}

export default GroupChatModel;
