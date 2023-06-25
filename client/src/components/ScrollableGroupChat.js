import React from 'react'
import { ChatState } from '../context/ChatProvider'

import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogic'
import { Avatar, Box, Tooltip } from '@chakra-ui/react'

function ScrollableGroupChat({messages}) {

  const { user } = ChatState()



  return (
    <div style={{width:'100%',}}>
         <ScrollableFeed  >
            {messages.map((m , i) => (
              <Box display={'flex'} key={m._id}>
                  {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i ,user._id)) ?
                    <Tooltip
                      label={m.sender.name}
                      placement='bottom-start'
                      hasArrow
                    >
                      <Avatar mt={7} mr={1} size={"sm"} cursor={'pointer'} name={m.sender.name} src={m.sender.pic} />
                    </Tooltip> : ""
                  }
                  <span
                    style={{
                      backgroundColor: `${m.sender._id === user._id ? '#bee3f8' : '#b9f5d0'}`,
                      borderRadius: "20px",
                      padding: "5px 15px",
                      maxWidth: "75%",
                      marginLeft: isSameSenderMargin(messages, m , i , user._id),
                      marginTop: isSameUser(messages, m , i , user._id) ? 10 : 3
                    }}
                  >
                    {m.content}
                  </span>
              </Box>
            ))}
        </ScrollableFeed>
    </div>
  )
}

export default ScrollableGroupChat
