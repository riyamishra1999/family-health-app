import { Flex, HStack, VStack } from "@chakra-ui/react";
import React from "react";
import Header from "../../molecules/Header";
import SideBar from "../../molecules/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  user?: any;
}

const Layout = ({ children, user }: LayoutProps) => {
  console.log(user, "layout user");
  return (
    <VStack w={"full"} spacing={1} position={"relative"} h={"100%"}>
      {user && <Header />}

      <HStack w={"full"} align={"stretch"} height="100%">
        {user && (
          <Flex w={"sm"} display={{ base: "none", lg: "flex" }}>
            <SideBar />
          </Flex>
        )}

        <div style={{ width: "100%", padding: "0 8px 0 8px", height: "85vh" }}>
          {children}
        </div>
      </HStack>
      {/* <Box position={"absolute"} bottom={0} w={"full"}>
          <Footer />
        </Box> */}
    </VStack>
  );
};

export default Layout;
