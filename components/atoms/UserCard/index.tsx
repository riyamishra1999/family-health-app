import { Avatar, Divider, HStack, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

interface UserCardProps {
  name?: string;
  photo?: any;
  id?: string;
  relation?: string;
}

const UserCard = ({ name, photo, id, relation }: UserCardProps) => {
  console.log(id);
  const router = useRouter();
  return (
    <HStack
      bg={"blue.50"}
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
      <VStack>
        <Text fontSize={"xl"} color="gray.700" fontWeight={"bold"}>
          {name}
        </Text>
        <Text
          fontFamily={"monospace"}
          fontSize={"md"}
          fontWeight={"medium"}
          py={"2"}
        >
          {relation}
        </Text>
      </VStack>
    </HStack>
  );
};

export default UserCard;
