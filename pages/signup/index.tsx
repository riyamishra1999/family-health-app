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
      .min(8, "minimum 8 characters")
      .required("password is required"),
    name: yup.string().required("name is required"),
    address: yup.string().required("address is required"),
    phone: yup
      .number()
      .min(10)
      .required("phone number is required")
      .typeError("invalid"),
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
      await onAuthStateChanged(auth, async (currentUser: any) => {
        setUser(currentUser);
      });
      router.push("/login");
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
              label="Your Name"
              type="text"
              register={register}
              name="name"
              error={errors?.name?.message}
            />
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

            <InputController
              label="Address"
              type="text"
              register={register}
              name="address"
              error={errors?.address?.message}
            />
            <InputController
              label="Phone"
              type="text"
              register={register}
              name="phone"
              error={errors?.phone?.message}
            />

            <Button
              mt="8"
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
