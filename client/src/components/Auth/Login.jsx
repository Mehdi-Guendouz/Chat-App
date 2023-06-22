import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function Login() {

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast()
  const navigate = useNavigate()
  

  const handleClick = () => {
        setShow(prev => !prev)
  }

  const submitHandler = async () => {
    if(!email || !password){
      toast({
          title: 'Warning',
          description: "You have to complete all the required fields",
          status: 'warning',
          duration: 9000,
          isClosable: true,
        })
        setLoading(false)
        return
    }

    try {
      setLoading(true)
        const config ={
          headers: {
          'Content-Type': 'application/json'
          }
        }

        const { data } = await axios.post('http://localhost:4000/api/user/login', {email, password}, config)
        toast({
          title: 'welcome',
          description: "welcome back to your account",
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
        localStorage.setItem('userinfo', JSON.stringify(data))
        setLoading(false)
        navigate("/chats")

    } catch (error) {
      // toast({
      //     title: 'error ',
      //     description: `${error.message}`,
      //     status: 'error',
      //     duration: 9000,
      //     isClosable: true,
      //   })
        setLoading(false)
        return
    }
    
  }

  return (
    <VStack spacing="10px">
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          value={email}
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Enter password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  )
}

export default Login
