import { HamburgerIcon } from "@chakra-ui/icons";
import { FiLogOut } from "react-icons/fi";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../utils/AuthContext";
import Sidebar from "../Sidebar";
import { auth } from "../../../utils/firebase-config";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { API } from "../../../utils/api";

const Header = () => {
  const { setUser } = useContext(AuthContext);
  const { onClose, isOpen, onOpen } = useDisclosure();
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [fetchUser, setFetchUser] = useState<any>();
  const handleSignOut = async () => {
    await signOut(auth)
      .then(() => {
        console.log("signout success");
        setUser(null);
        router.push("/login");
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };
  // const fetchUserFromDB = async () => {
  //   await API.get(
  //     `http://localhost:5000/api/v1/student/getByfirebase/` + user?.uid
  //   ).then((res) => {
  //     console.log(res, ">>>>>>>>>>>>response after fetch");
  //     setFetchUser(res);
  //   });
  // };
  // useEffect(() => {
  //   fetchUserFromDB();
  // }, []);
  console.log(fetchUser, "fetcheduser >>>>>>>>>>>>>...");
  return (
    <Flex
      bg={"green.50"}
      height={"12vh"}
      w={"full"}
      borderLeft={"2px"}
      borderColor={"white"}
      shadow="md"
      align={"center"}
      px={2}
      py={10}
      justify={"space-between"}
    >
      <Box display={{ base: "block", lg: "none" }} px={2}>
        <IconButton
          aria-label="show menu"
          icon={<HamburgerIcon />}
          colorScheme="green"
          onClick={onOpen}
        />
        <Drawer placement={"left"} onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">
              Family Health App
            </DrawerHeader>
            <DrawerBody>
              <Sidebar />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
      <Flex align="center" gap={2}>
        <Heading
          ml={{ base: 0, md: "5" }}
          display={{ base: "none", md: "flex" }}
          fontSize={{ base: "xl", md: "3xl" }}
          textAlign={{ base: "start", md: "center" }}
          lineHeight={1.6}
          color={"green.500"}
          cursor="pointer"
          onClick={() => router.push("/")}
        >
          Family Health App
        </Heading>
      </Flex>
      <Tooltip
        label="logout"
        aria-label="logout text"
        bg="red.500"
        color="white"
      >
        <IconButton
          mr="2"
          aria-label="logout"
          icon={<FiLogOut />}
          colorScheme={"green"}
          _hover={{
            bg: "red.500",
          }}
          onClick={handleSignOut}
        ></IconButton>
      </Tooltip>
    </Flex>
  );
};

export default Header;
