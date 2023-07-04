import React from "react";
import {
  Box,
  Container,
  Text,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Image,
} from "@chakra-ui/react";

import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import { useHistory } from "react-router";
import { useEffect } from "react";
import logo from "../asset/mChat.png";

const Home = () => {
  const history = useHistory();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      history.push("/");
    }

  }, [history]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        width="100%"
        borderRadius="lg"
        justifyContent={"center"}
      >
       
        <Image src={logo} height={"100px"} width={"100px"}></Image>
      </Box>
      <Box
        bg={"rgb(17,27,33)"}
        w={"100%"}
        borderRadius={"lg"}
        padding={4}
      >
        <Tabs isFitted variant="soft-rounded" colorScheme="green">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Register</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Register />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;
