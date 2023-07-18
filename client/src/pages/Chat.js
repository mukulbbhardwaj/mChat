import { ChatState } from "../Context/ChatProvider";
import ChatBox from "../components/ChatBox";
import MyChat from "../components/MyChat";
import SideDrawer from "../components/misc/SideDrawer";
import { Box } from "@chakra-ui/react";
import { useState } from "react";

const Chat = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent={"space-between"}
        width={"100%"}
        height={"90vh"}
        p={"10px"}
      >
        {user && <MyChat fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
      
    </div>
  );
};

export default Chat;
