import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  IconButton,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { ArrowLeftIcon } from "@chakra-ui/icons";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputController } from "../../components/molecules/InputController";
import { useRouter } from "next/router";

import { AuthContext } from "../../utils/AuthContext";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../../utils/firebase-config";

const SignUp = () => {
  const toast = useToast();
  const router = useRouter();
  const { user, setUser } = useContext(AuthContext);
  const signUpSchema = yup.object().shape({
    email: yup.string().email().required("email is required"),
    password: yup
      .string()
      .min(8, "passwords length should be 8 or more")
      .required("password is required"),
  });
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
  } = useForm({ mode: "all", resolver: yupResolver(signUpSchema) });
  const submitHandler = async (data: any) => {
    console.log(data, "data>>>");
    try {
      await createUserWithEmailAndPassword(auth, data?.email, data?.password);
      onAuthStateChanged(auth, (currentUser: any) => {
        setUser(currentUser);
      });
      router.push("/login");
      toast({
        title: "verify email",
        status: "warning",
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: `${error.message
          .split("/")[1]
          .split(")")[0]
          .replaceAll("-", " ")}`,
        status: "error",
        position: "top-right",
        isClosable: true,
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <Box w="full" px={10}>
        <Flex w="full" gap={6} align="center" justify={"center"} mb="10" mt="2">
          <IconButton
            colorScheme={"gray"}
            rounded="full"
            color="green"
            aria-label="back"
            icon={<ArrowLeftIcon />}
            onClick={() => router.push("/login")}
          />
          <Heading textAlign={"center"} color={"green"}>
            Sign Up for Family Health App
          </Heading>
        </Flex>
        <Center>
          <Flex
            direction={"column"}
            width={{ base: "full", sm: "md", md: "xl" }}
          >
            <InputController
              label="Email"
              type="email"
              register={register}
              name="email"
              error={errors?.email?.message}
            />
            <InputController
              label="Password"
              type="password"
              register={register}
              name="password"
              error={errors?.password?.message}
            />
            <Button
              mt="6"
              type="submit"
              isLoading={isSubmitting}
              colorScheme={"green"}
            >
              Signup
            </Button>
          </Flex>
        </Center>
      </Box>
    </form>
  );
};

export default SignUp;
