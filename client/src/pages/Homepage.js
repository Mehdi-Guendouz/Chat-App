import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Login from '../components/Auth/Login'
import Signup from '../components/Auth/Signup'
import { useNavigate  } from 'react-router-dom';

function Homepage() {
  const navigate = useNavigate()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userinfo'));
    if (user) navigate('/chats')   
    // console.log(user)
  }, []);

  return (
    <Container maxW={'xl'} centerContent>
        <Box
            d="flex"
            justifyContent={'center'}
            p={3}
            bg={"white"}
            width={"100%"}
            m="40px 0 15px 0"
            borderRadius={"lg"}
            borderWidth={"1px"}
        >
            <Text align={"center"} fontSize="4xl" fontFamily={"work sans"}>
                Talk-A-Tive
            </Text>
        </Box>
        <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Homepage
