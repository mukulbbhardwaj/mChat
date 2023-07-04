import React, { useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, Button, Stack, useToast, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useState } from "react";
import ChatLoading from "./ChatLoading";
import axios from "axios";
import { getSender } from "../config/ChatLogics";
import GroupChatModal from "./misc/GroupChatModal";

const MyChat = ({ fetchAgain }) => {
  const toast = useToast();
  const [loggedUser, setLoggedUser] = useState();
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error",
        status: "warning",
        description: error.message,
        isClosable: true,
        duration: 5000,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir={"column"}
      alignItems={"center"}
      p={3}
      bg={"rgb(17,27,33)"}
      w={{ base: "100%", md: "30%" }}
      borderRadius={"lg"}
      borderRightWidth={"1px"}
      borderColor={"gray"}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "24px", md: "28px" }}
        display={"flex"}
        w={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        Chats
        <GroupChatModal>
          <Button
            display={"flex"}
            fontSize={{ base: "14px", md: "18px" }}
            rightIcon={<AddIcon />}
          >
            Add Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display={"flex"}
        flexDir={"column"}
        p={3}
        // bg={"gray"}
        w={"100%"}
        h={"100%"}
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        {chats ? (
          <Stack overflowY={"scroll"}>
            {chats.map((chat ) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor={"pointer"}
                bg={selectedChat === chat ? "#70CBDE" : "#67E29F"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius={"lg"}
                key={chat._id}
              >{console.log(chat)}
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChat;
