import { Avatar, HStack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

interface UserCardProps {
  name?: string;
  photo?: any;
  id?: string;
}

const UserCard = ({ name, photo, id }: UserCardProps) => {
  console.log(id);
  const router = useRouter();
  return (
    <HStack
      bg={"green.100"}
      height="100"
      justify={"center"}
      gap="8"
      rounded="lg"
      p="4"
      cursor={"pointer"}
      boxShadow={"md"}
      _hover={{
        boxShadow: "lg",
      }}
      onClick={() => router.push(`/user/${id}`)}
    >
      <Avatar name={name} src={photo} size="lg" />
      <Text fontSize={"xl"} color="gray.700" fontWeight={"bold"}>
        {name}
      </Text>
    </HStack>
  );
};

export default UserCard;
