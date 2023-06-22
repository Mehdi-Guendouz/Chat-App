import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Toast, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'

import React, { useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import ProfileModel from './ProfileModel';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from '../userAvatar/UserListItem';

const SideDrawer = () => {

    const navigate = useNavigate()
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [chatloading, setChatLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const {user , setSelectedChat, selectedChat, chats, setChats } = ChatState()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    const logOut = () => {
        localStorage.removeItem("userinfo")
        navigate("/")
    }
    
    const handleSearch = async () => {
        if(!search) {
            toast({
                title: 'No input found',
                description: "Please provide some input first.",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })  
            return
        }

        try {
            setLoading(true)
            const config = {
                headers:{
                    Authorization: `Bearer ${user.token}` ,
                }
            }
            const {data} = await axios.get(`http://localhost:4000/api/user?search=${search}`, config)
            setLoading(false)
            setSearchResult(data)
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

    const CreateChat = async (userId) => {
        try {
            setChatLoading(true)
            const config = {
                headers:{
                    "content-type": "application/json",
                    Authorization: `Bearer ${user.token}` ,
                }
            }
            const { data } = await axios.post(`http://localhost:4000/api/chat`,{ userId } , config)
            console.log(data)
            if(!chats.find((c) => c._id === data._id)) setChats([data, ...chats])

            setChatLoading(false)
            setSelectedChat(data)
            onClose()
        } catch (error) {
            toast({
                title: 'there is an error',
                description: `${error.message}`,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            setChatLoading(false)
            console.log(error)
        }
    }

    return (
        <>
            <Box 
                display="flex"  
                alignItems={"center"} 
                justifyContent={"space-between"} 
                padding={"5px 10px 5px 10px"} 
                bg={"white"}
                w={"100%"}
                borderWidth={"5px"}
            >
                <Tooltip label="search for a user"  hasArrow placement='bottom' >
                    <Button onClick={onOpen}>
                        <i className="fas fa-search"></i>
                        <Text display={{base: "none", md: "flex" }} px={4}>
                            Search User
                        </Text> 
                    </Button>
                </Tooltip>
                <Text fontSize="2xl" fontFamily="Work sans">
                    Talk-A-Tive
                </Text>
                <div>
                    <Menu>
                    <MenuButton>
                        <BellIcon fontSize={'2xl'} m={1} />
                    </MenuButton>
                        {/* <MenuList></MenuList> */}
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                            <Avatar cursor={'pointer'} size={'sm'} name={user.name} src={user.pic}/>
                        </MenuButton>
                        <MenuList>
                            <ProfileModel user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModel>
                            <MenuDivider/> 
                            <MenuItem onClick={logOut}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                <DrawerBody>
                <Box display="flex" pb={2}>
                    <Input
                        placeholder="Search by name or email"
                        mr={2}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button onClick={handleSearch}>Go</Button>
                </Box>
                {loading ? <ChatLoading /> : (
                    searchResult?.map(user => (
                    <UserListItem key={user._id} user={user} handleFunction={() => CreateChat(user._id)} />
                    
                )))}
                {chatloading && <Spinner ml={'auto'} display={'flex'}/>}
            </DrawerBody>
        </DrawerContent>
      </Drawer>
        </>
    );
}

export default SideDrawer;
