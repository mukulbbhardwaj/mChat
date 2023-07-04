import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Button,
  useToast,
} from "@chakra-ui/react";
import axios from 'axios'
import React, { useState } from "react";
import { useHistory } from 'react-router-dom';

function Register() {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pfp, setPfp] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();
  const handleClick = () => {
    setShow(!show);
  };
  const postDetails = (pfp) => {
    setLoading(true);
    if (pfp === undefined) {
      toast({
        title: "Please select an Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (pfp.type === "image/jpeg" || pfp.type === "image/png") {
      const data = new FormData();
      data.append("file", pfp);
      data.append("upload_preset", "baatchat");
      axios.post("https://api.cloudinary.com/v1_1/mimeniac/image/upload",data)
        .then((res) => {
          setPfp(res.data.url.toString());
          console.log(res.data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };
  const submitHandler = async () => {
    console.log("MK")
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Password Don't Match",
        status: "warning",
        duration: 5000,
        position: "bottom",
        isClosable: true,
      });
      return;
    }
    try {
      const config = {
        header: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post("/api/user", { name, email, password, pfp }, config);
      toast({
        title: "Registration Succesful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      history.push('chats');


    } catch (error) {
      toast({
        title: "Error Occured !",
        description:error.response.data.message,
        status: "warning",
        duration: 5000,
        position: "bottom",
        isClosable: true,
      });
      setLoading(false);
    }
  };



  return (
    <VStack spacing={"5px"}>
      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          placeholder="Your name"
          onChange={(e) => setName(e.target.value)}
        ></Input>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="mukul@google.com"
          onChange={(e) => setEmail(e.target.value)}
        ></Input>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          ></Input>
          <InputRightElement marginRight={"5px"}>
            <Button
              colorScheme="teal"
              size="xs"
              fontSize={12}
              onClick={handleClick}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement marginRight={"5px"}>
            <Button
              colorScheme="teal"
              size="xs"
              fontSize={12}
              onClick={handleClick}
             
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pfp">
        <FormLabel>Upload your Profile Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="teal"
        onClick={submitHandler}
        width={"100%"}
        style={{ marginTop: 18 }}
        isLoading={loading}
      >
        SignUp
      </Button>
    </VStack>
  );
}

export default Register;
