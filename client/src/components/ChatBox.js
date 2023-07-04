import React from "react";
import { ChatState } from "../Context/ChatProvider";
import SingleChat from "./SingleChat";
import { Box } from "@chakra-ui/react";
const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems={"center"}
      flexDir={"column"}
      p={3}
      bg={"rgb(17,27,33)"}
      w={{ base: "100%", md: "70%" }}
      borderRadius={"lg"}
     
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
