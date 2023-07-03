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
} from "@chakra-ui/react";

import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import { useHistory } from "react-router";
import { useEffect } from "react";
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
        p="3"
        bg="white"
        width="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        justifyContent={"center"}
      >
        <Text fontSize="4xl">ChatApp</Text>
      </Box>
      <Box
        bg={"white"}
        w={"100%"}
        borderRadius={"lg"}
        borderWidth={"1px"}
        padding={4}
      >
        <Tabs isFitted variant="soft-rounded">
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
