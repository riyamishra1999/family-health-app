import { Box, Flex, Heading, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import UserCard from "../../atoms/UserCard";

interface usersListProps {
  users?: any;
}

const UsersList = ({ users }: usersListProps) => {
  console.log(users, "uselisr");
  return (
    <Box w="full">
      <Heading color="gray.800" mb="10">
        Your Family Members
      </Heading>
      <SimpleGrid minChildWidth={"200px"} columns={[1, null, 2]} spacing={10}>
        {users?.length > 0 &&
          users?.map((user: any, key: any) => (
            <UserCard
              key={key}
              name={user?.name}
              photo={user?.photo}
              id={user?.userId}
            />
          ))}
      </SimpleGrid>
    </Box>
  );
};

export default UsersList;
