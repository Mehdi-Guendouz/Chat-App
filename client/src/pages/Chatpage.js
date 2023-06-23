import React, { useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SideDrawer from '../components/miscellaneous/SideDrawer'
import MyChats from '../components/miscellaneous/MyChats'
import Chatbox from '../components/miscellaneous/Chatbox'

function Chatpage() {
  const { user } = ChatState()
  const [fetchAgain, setFetchAgain] = useState(false);
  
 
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox  fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
        )}
      </Box>
    </div>
  )
}

export default Chatpage
