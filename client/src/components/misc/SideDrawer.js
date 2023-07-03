import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";

import React, { useState } from "react";
import { Search2Icon, BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const history = useHistory();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const logOutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };
  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "please enter something to see search results...",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorisation: `Bearer${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);

      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        status: error,
        isClosable: true,
        duration: 2000,
        position: "top-left",
      });
    }
  };

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        width={"100%"}
        borderWidth={"2px"}
        padding={"5px 10px 5px 10px"}
      >
        <Tooltip label="Search Users" hasArrow placement="bottom-end">
          <Button variant={"ghost"} ref={btnRef} onClick={onOpen}>
            <Search2Icon padding={"0px 1px 0px 1px"} />
            {/* <Text display={{ base: "none", md: "flex" }}>Search User</Text> */}
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontWeight={600}>
          BaatChat
        </Text>
        <div>
          <Menu>
            <MenuButton p={"2px"}>
              <BellIcon fontSize={"2xl"} margin={1} />
              <MenuList pl={2}>
                {!notification.length && "No New Messages"}
                {notification.map((notif) => (
                  <MenuItem key={notif._id} onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif))
                  }}>
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chanName}`
                      : `New Message from ${getSender(user, notif.chat.users)}`}
                  </MenuItem>
                ))}
              </MenuList>
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.pfp}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logOutHandler}>LogOut</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search User</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="Search by name or email..."
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              ></Input>
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
