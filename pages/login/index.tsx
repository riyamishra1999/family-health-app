import { Box, Button, Center, Flex, Heading, useToast } from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { InputController } from "../../components/molecules/InputController";
import { AuthContext } from "../../utils/AuthContext";
import { useRouter } from "next/router";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../../utils/firebase-config";
import Head from "next/head";

const Login = () => {
  const toast = useToast();
  const router = useRouter();

  const schema = Yup.object().shape({
    email: Yup.string().required("email is required"),
    password: Yup.string().required("password is required"),
  });
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });
  const { setUser, user } = useContext(AuthContext);
  const loginHandler = async (data: any) => {
    try {
      await signInWithEmailAndPassword(auth, data?.email, data?.password);
      onAuthStateChanged(auth, async (currentUser: any) => {
        setUser(currentUser);
      });
      if (user) {
        toast({
          title: "logged in successfully",
          status: "success",
          isClosable: true,
        });
      }
      router.push("/");
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
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, []);
  console.log(errors, "errors>>>");
  return (
    <form onSubmit={handleSubmit(loginHandler)}>
      <Box w="full" px={10} mt={"6"}>
        <Box boxShadow={"md"} py="4" px="2" rounded="md" background="gray.50">
          <Heading
            textAlign={"center"}
            color="blue.500"
            textShadow={"xl"}
            size={"xl"}
            // fontFamily={"mono"}
            mb={"8"}
          >
            Family Health App Login
          </Heading>
          <Center>
            <Flex
              direction={"column"}
              width={{ base: "full", sm: "md", md: "xl" }}
            >
              <InputController
                label="Email Address"
                name="email"
                register={register}
                type="text"
                error={errors?.email?.message}
              />
              <InputController
                label="Password"
                name="password"
                register={register}
                type="password"
                error={errors?.password?.message}
              />
              <Button
                type="submit"
                colorScheme={"twitter"}
                mt={10}
                isLoading={isSubmitting}
              >
                Login
              </Button>
              <Button
                variant="link"
                mt={4}
                colorScheme={"gray"}
                onClick={() => router.push("/signup")}
              >
                Not registered? Create your account
              </Button>
            </Flex>
          </Center>
        </Box>
      </Box>
    </form>
  );
};

export default Login;
