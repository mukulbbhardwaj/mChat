import { React, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  IconButton,
  useToast,
  Box,
  Input,
  FormControl,
  Button,
  ModalFooter,
  Spinner,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";
import axios from "axios";

const UpdateGroupChatModal = (fetchMessages) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat, setSelectedChat, user, fetchAgain, setFetchAgain } =
    ChatState();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const toast = useToast();

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
        description: error.message,
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {}
  };

  const handleAddUser = async (newUser) => {
    console.log(newUser._id);
    if (selectedChat.users.find((u) => u._id === newUser._id)) {
      toast({
        title: "User Already Present",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only Admin can add someone",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: newUser._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  const handleRemove = async (delUser) => {
    if (selectedChat.groupAdmin._id !== user._id && delUser._id !== user._id) {
      toast({
        status: "warning",
        title: "Only Admin Can remove Someone",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: delUser._id,
        },
        config
      );

      delUser._id === user._id ? setSelectedChat() : setSelectedChat(data);

      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {}
  };

  return (
    <>
      <IconButton
        onClick={onOpen}
        display={{ base: "flex" }}
        icon={<ViewIcon />}
      />
      <Modal isOpen={isOpen} onClose={onClose} size={"sm"} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            textAlign={"center"}
            display={"flex"}
            justifyContent={"center"}
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Box>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display={"flex"}>
              <Input
                placeholder="Group Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant={"solid"}
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl display={"flex"}>
              <Input
                placeholder="Search to add Users"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size={"lg"} />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
