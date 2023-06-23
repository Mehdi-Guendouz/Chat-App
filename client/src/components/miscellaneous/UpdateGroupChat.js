import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import UserBadgeItem from '../userAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../userAvatar/UserListItem';

function UpdateGroupChat({setFetchAgain}) {
    const [updateGroupName, setUpdateGroupName] = useState('');
    const [loading, setLoading] = useState(false);
    const [groupRenameLoading, setGroupRenameLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const {user , selectedChat , setSelectedChat } = ChatState()

    
    const toast = useToast()

    const handelDelete = async (deletedUser) =>{

        if(selectedChat.groupAdmin._id !== user._id){
            toast({
                title: 'error',
                description: "only admin can remove people from this group",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })  
            return 
        }

        if(deletedUser._id === user._id){
            toast({
                title: 'warning',
                description: "You can't delete yourself",
                status: 'warning',
                duration: 9000,
                isClosable: true,
            })  
            return 
        }

        
        try {
            const config = {
                headers:{
                    Authorization: `Bearer ${user.token}`,
                }
            }

            const { data } = await axios.put('http://localhost:4000/api/chat/groupRemove', {groupId:selectedChat._id , removeMember: deletedUser._id},config)
            setSelectedChat(data)
            setFetchAgain(prev => !prev)

        } catch (error) {
            toast({
                title: 'error',
                description: "an error occurred try again",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })  
            console.log(error)
        }
    }
    const handleRename = async () =>{
        if(!updateGroupName || updateGroupName === selectedChat.chatName){
             toast({
                title: 'please choose a new name',
                description: "no chat",
                status: 'warning',
                duration: 9000,
                isClosable: true,
            })  
            return
        } 

        try {
            setGroupRenameLoading(true)
            const config = {
                headers:{
                    Authorization: `Bearer ${user.token}`,
                }
            }

            const { data } = await axios.put('http://localhost:4000/api/chat/rename', {groupId:selectedChat._id , groupName: updateGroupName},config)
            setSelectedChat(data)
            setFetchAgain(prev => !prev)
            setGroupRenameLoading(false)
            
            
        } catch (error) {
            toast({
                title: 'error',
                description: "Rename failed",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })  
            console.error(error)
            setGroupRenameLoading(false)
        }

    }
    const handleSearch = async (query) =>{
        setSearch(query)
        try {
            setLoading(true)
            const config = {
                headers:{
                    Authorization: `Bearer ${user.token}` ,
                }
            }
            const {data} = await axios.get(`http://localhost:4000/api/user?search=${search}`, config)
            setLoading(false)
            setSearchResults(data)
            // console.log(data)
        } catch (error) {
            toast({
                title: 'there is an error trying to search',
                description: `failed to load the search results`,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })  
            setLoading(false)
        }
    }

    const handleLeaveGroup = async () =>{
         try {
            const config = {
                headers:{
                    Authorization: `Bearer ${user.token}`,
                }
            }

            const { data } = await axios.put('http://localhost:4000/api/chat/groupRemove', {groupId:selectedChat._id , removeMember: user._id},config)
            setSelectedChat()
            setFetchAgain(prev => !prev)

        } catch (error) {
            toast({
                title: 'error',
                description: "an error occurred try again",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })  
            console.log(error)
        }

    }

    const handleAddUser = async (addedUser) =>{
        if(selectedChat.users.find(user => user._id === addedUser._id)){
            toast({
                title: 'this user is already in the group chat',
                description: `choose another user`,
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
                    Authorization: `Bearer ${user.token}`,
                }
            }

            const { data } = await axios.put('http://localhost:4000/api/chat/groupadd', {groupId:selectedChat._id , addMember: addedUser._id},config)
            setSelectedChat(data)
            setFetchAgain(prev => !prev)
            setLoading(false)
            
        } catch (error) {
            toast({
                title: 'an error occurred',
                description: `try again`,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })  
            setLoading(false)
        }


    }

    return (
        <>
        <IconButton display={{ base: "flex" }} icon={<ViewIcon />}  onClick={onOpen} />

        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
             <ModalHeader
                fontSize="35px"
                fontFamily="Work sans"
                display="flex"
                justifyContent="center"
            >
                {selectedChat.chatName}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody display="flex" flexDir="column" alignItems="center">
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                    {selectedChat.users.map(u => (
                        <UserBadgeItem user={u} key={u._id} handleFunction={() => handelDelete(u)}/>
                    ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={updateGroupName}
                onChange={(e) => setUpdateGroupName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={groupRenameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            {selectedChat.groupAdmin._id === user._id ? (
                <>
                    <FormControl>
                    <Input
                        placeholder="Add User to group"
                        mb={1}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    </FormControl>
                    {loading ? <Spinner size={'lg'}/> : (
                        searchResults?.map( user => (
                            <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
                        ))
                    )}
                </>
            ) : <></>}
            
            </ModalBody>

            <ModalFooter>
               <Button onClick={() => handleLeaveGroup(user)} colorScheme="red">
                Leave Group
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}

export default UpdateGroupChat
