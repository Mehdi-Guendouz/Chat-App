import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';



const Signup = () => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [confirmpassword, setConfirmpassword] = useState();
    const [password, setPassword] = useState('');
    const [pic, setPic] = useState();
    const [picLoading, setPicLoading] = useState(false);
    const toast = useToast()
    const navigate = useNavigate();


    const handleClick = () => {

        setShow(prev => !prev)
    }

    const postDetails = (pics) => {

    }


    const submitHandler = async () => {
      setPicLoading(true)
      if (!name || !email || !password){
        toast({
          title: 'Warning',
          description: "You have to complete all the required fields",
          status: 'warning',
          duration: 9000,
          isClosable: true,
        })
        setPicLoading(false)
        return
      }
      if(password !== confirmpassword){
        toast({
          title: 'Warning',
          description: "Unmatched passwords",
          status: 'warning',
          duration: 9000,
          isClosable: true,
        })
        setPicLoading(false)
        return
      }
      try{
        setPicLoading(true)
        const config ={
          headers: {
          'Content-Type': 'application/json'
          }
        }

        const { data } = await axios.post('http://localhost:4000/api/user', {name, email, password}, config)

        toast({
          title: 'congratulation',
          description: "welcome to chat",
          status: 'success',
          duration: 9000,
          isClosable: true,
        })

        localStorage.setItem("userInfo", JSON.stringify(data))
        setPicLoading(false)
        navigate("/chats")
      }catch(error){
        console.log(error)
        toast({
          title: 'something went wrong',
          description: `${error.response.data.message}`,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
        setPicLoading(false)
      }
      
    }


    return (
    <VStack spacing={"5px"} >
      <FormControl isRequired id='first-name'>
        <FormLabel>Name</FormLabel>
        <Input 
          placeholder='Enter your Name'
          onChange={(e) => setName(e.target.value) }
        />
      </FormControl>
      <FormControl isRequired id='email'>
        <FormLabel>Email</FormLabel>
        <Input 
          placeholder='Enter your Email'
          onChange={(e) => setEmail(e.target.value) }
        />
      </FormControl>

       <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

        <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={picLoading}

      >
        Sign Up
      </Button>
    </VStack>
    );
}

export default Signup;
