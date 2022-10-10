import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { API } from "../../utils/api";
import FilePicker from "chakra-ui-file-picker";
import { Controller, useForm } from "react-hook-form";
import { InputController } from "../../components/molecules/InputController";
const UserPage = () => {
  const router = useRouter();
  const id = router.query.id;
  const [fetchUser, setFetchUser] = useState<any>();
  const FetchUser = async () => {
    const response: any = await API.get(`/user/${id}`);
    console.log(response, "rsss");
    setFetchUser(response?.data);
  };
  useEffect(() => {
    FetchUser();
  }, []);

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    setValue,
    control,
  } = useForm({
    mode: "all",
  });

  const SubmitHandler = (data: any) => {
    console.log(data);
  };
  const [imageUrl, setImageUrl] = useState<any>([]);
  const url: any = [];
  return (
    <Box width={{ base: "full", md: "lg" }} p="4">
      <HStack>
        <Heading>{fetchUser?.name}</Heading>
        <Text>{fetchUser?.relation}</Text>
      </HStack>
      <Heading my="4">Medical Records</Heading>
      <form onSubmit={handleSubmit(SubmitHandler)}>
        <VStack align={"stretch"} spacing="5">
          <FormControl>
            <FormLabel>Date of Prescription</FormLabel>
            <InputController
              register={register}
              name="dateOfPrescription"
              type="date"
            />
          </FormControl>
          <VStack align="stretch" spacing={"-1"}>
            <FormLabel>Upload Prescription Image</FormLabel>
            <Controller
              name="images"
              control={control}
              render={({ field }) => (
                <FilePicker
                  {...field}
                  onFileChange={(fileList: any) => {
                    fileList?.map((file: any) =>
                      url.push(URL.createObjectURL(file))
                    );

                    setImageUrl(url);
                    setValue("images", fileList);
                  }}
                  placeholder="Select files..."
                  clearButtonLabel="Clear"
                  multipleFiles={true}
                  accept="image/*"
                  hideClearButton={false}
                />
              )}
            />

            <SimpleGrid minChildWidth={100} p="2" gap="1">
              {imageUrl?.length > 0 &&
                imageUrl?.map((item: any, key: any) => (
                  <img
                    key={`banner-${key}`}
                    src={item}
                    height="200"
                    width="200"
                  />
                ))}
            </SimpleGrid>
          </VStack>
          <Button
            mt={4}
            w="full"
            colorScheme="green"
            isLoading={isSubmitting}
            type="submit"
          >
            Submit
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default UserPage;
