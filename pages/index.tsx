import { AddIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputController } from "../components/molecules/InputController";
import { AuthContext } from "../utils/AuthContext";

import withPrivateRoute from "../withPrivateRoute";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { API } from "../utils/api";
import UsersList from "../components/molecules/UsersList";
const Home: NextPage = () => {
  const validationSchema = yup.object().shape({
    name: yup.string().required("name is required"),
    dateOfBirth: yup.date().required("date of birth is required"),
    gender: yup.string().required("gender is required"),
    relation: yup.string().required("your relation is required"),
    image: yup.mixed(),
  });
  const { user, setUser } = useContext(AuthContext);
  const [family, setFamily] = useState<any>();
  const toast = useToast();
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<any>();
  const [fileObj, setFileObj] = useState<any>();
  const {
    handleSubmit,
    register,
    reset,
    control,

    formState: { errors, isSubmitting },
  } = useForm({ mode: "all", resolver: yupResolver(validationSchema) });

  const genderOptions = [
    {
      option: "Male",
      value: "male",
    },
    {
      option: "Female",
      value: "female",
    },
  ];

  const relationOptions = [
    {
      option: "father",
    },
    {
      option: "mother",
    },
    {
      option: "husband",
    },
    {
      option: "wife",
    },
    {
      option: "son",
    },
    {
      option: "daughter",
    },
    {
      option: "brother",
    },
    {
      option: "sister",
    },
    {
      option: "grandfather",
    },
    {
      option: "grandmother",
    },
  ];

  const createUserHandler = async (data: any) => {
    try {
      var formData = new FormData();
      formData.append("familyFirebaseId", user?.uid);
      formData.append("name", data?.name);
      formData.append("gender", data?.gender);
      formData.append("relation", data?.relation);
      formData.append("dateOfBirth", data?.dateOfBirth);
      formData?.append("image", fileObj);

      const response: any = await API.post("/user/create", formData);
      if (response) {
        console.log(response);
        toast({
          title: "Successfully added",
          status: "success",
        });
        fetchFamilyInformation();
      }
    } catch (error) {
      toast({
        status: "error",
        title: "some error occurred",
      });
    }
    reset({
      keepValues: false,
    });
    onToggle();
  };
  const fetchFamilyInformation = async () => {
    try {
      const response: any = await API.get("/family/" + user?.uid);
      setFamily(response);
      console.log(response, "family");
    } catch (error) {}
  };
  useEffect(() => {
    fetchFamilyInformation();
  }, []);
  console.log(family, "family");
  const handleOnChange = async (e: any) => {
    const url: any = URL.createObjectURL(e.target.files[0]);
    setImageUrl(url);

    setFileObj(e.target.files[0]);
  };
  const openHandler = () => {
    onToggle();
    setImageUrl(null);
    reset({
      keepValues: false,
    });
  };
  console.log(errors, "errors>>><>");
  return (
    <Box>
      <Flex
        w="full"
        align="start"
        justify={"center"}
        direction={"column"}
        gap="10"
        mt="4"
        px="2"
      >
        <Heading
          px="2"
          lineHeight={1.6}
          fontSize={{ base: "3xl", md: "4xl" }}
          color="gray.700"
        >
          Welcome {family?.name},
        </Heading>
        <Button
          onClick={() => openHandler()}
          shadow={"md"}
          colorScheme={"green"}
          size="lg"
          height={"80px"}
          p="10"
          gap={"6"}
          rightIcon={<AddIcon />}
        >
          Add family member
        </Button>
        <Divider />
        <UsersList users={family?.users} />
      </Flex>
      <Modal
        size={{ md: "xl" }}
        colorScheme={"green"}
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="green.500">Add family member</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box px="2" py="4" color="gray.800">
              <form onSubmit={handleSubmit(createUserHandler)}>
                <VStack gap={"10px"} align={"stretch"}>
                  <Box>
                    {imageUrl && (
                      <Center rounded={"full"}>
                        <Avatar src={imageUrl} size={"2xl"} />
                      </Center>
                    )}

                    <Controller
                      name="image"
                      control={control}
                      render={({ field }) => (
                        <FormControl>
                          <FormLabel>Upload Image</FormLabel>
                          <Input
                            {...field}
                            type="file"
                            onChange={handleOnChange}
                          />
                        </FormControl>
                      )}
                    />
                  </Box>
                  <InputController
                    name="name"
                    register={register}
                    label="Name"
                    error={errors?.name?.message}
                  />
                  <InputController
                    type="date"
                    name="dateOfBirth"
                    register={register}
                    label="Date of Birth"
                    error={errors?.dateOfBirth?.message}
                  />
                  <FormControl isInvalid={!!errors?.gender?.message}>
                    <FormLabel>Gender</FormLabel>

                    <Select {...register("gender")} defaultValue="">
                      <option hidden disabled value="">
                        select gender...
                      </option>
                      {genderOptions.map((item: any, key: any) => (
                        <option key={key} value={item.value}>
                          {item.option}
                        </option>
                      ))}
                    </Select>
                    <FormErrorMessage>
                      {errors?.gender?.message?.toString()}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors?.relation?.message}>
                    <FormLabel>Relation</FormLabel>

                    <Select {...register("relation")} defaultValue="">
                      <option disabled value="">
                        select your relation...
                      </option>
                      {relationOptions.map((item, key) => (
                        <option key={key} value={item.option}>
                          {item.option}
                        </option>
                      ))}
                    </Select>
                    <FormErrorMessage>
                      {errors?.relation?.message?.toString()}
                    </FormErrorMessage>
                  </FormControl>
                  <Button
                    isLoading={isSubmitting}
                    width={"full"}
                    leftIcon={<AddIcon />}
                    colorScheme="green"
                    type="submit"
                  >
                    Add
                  </Button>
                </VStack>
              </form>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default withPrivateRoute(Home);
