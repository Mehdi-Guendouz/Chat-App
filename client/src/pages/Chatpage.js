import React from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SideDrawer from '../components/miscellaneous/SideDrawer'
import MyChats from '../components/miscellaneous/MyChats'
import Chatbox from '../components/miscellaneous/Chatbox'

function Chatpage() {
  const { user } = ChatState()

 
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats  />}
        {user && (
          <Chatbox  />
        )}
      </Box>
    </div>
  )
}

export default Chatpage
