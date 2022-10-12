import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
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
import { AddIcon } from "@chakra-ui/icons";
import axios from "axios";
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
  const [searchText, setSearchText] = useState<string>("");
  const [dataICD, setDataICD] = useState<any>();

  // const token_endpoint = "https://icdaccessmanagement.who.int/connect/token";
  // const client_id =
  //   "7d6cce10-14f6-43c5-808a-a7a026281d96_350c3e42-786b-4744-a563-c92632f8f8e0";
  // const client_secret = "VrIuu8C6JKaqfBqpRct9etr4ZNunKJc/ggvmr4eeywc=";
  // const scope = "icdapi_access";
  // const grant_type = "client_credentials";

  const queryICD = async () => {
    const response: any = await axios.get(
      `https://id.who.int/icd/entity/search?q=${searchText}&useFlexisearch=false&flatResults=true&highlightingEnabled=true`,
      {
        headers: {
          Accept: "application/json",
          "API-Version": "v2",
          "Accept-Language": "en",
          Authorization:
            "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE2NjU1MDI4NjIsImV4cCI6MTY2NTUwNjQ2MiwiaXNzIjoiaHR0cHM6Ly9pY2RhY2Nlc3NtYW5hZ2VtZW50Lndoby5pbnQiLCJhdWQiOlsiaHR0cHM6Ly9pY2RhY2Nlc3NtYW5hZ2VtZW50Lndoby5pbnQvcmVzb3VyY2VzIiwiaWNkYXBpIl0sImNsaWVudF9pZCI6IjdkNmNjZTEwLTE0ZjYtNDNjNS04MDhhLWE3YTAyNjI4MWQ5Nl8zNTBjM2U0Mi03ODZiLTQ3NDQtYTU2My1jOTI2MzJmOGY4ZTAiLCJzY29wZSI6WyJpY2RhcGlfYWNjZXNzIl19.l8BjnbW-DenZtFHbNMo1bdYcOUkxSbs8uSkpSeW_D_HH6kC_f_M0MECcel1Dak7av89oJr605BUc0FH8EUCK6_CAg9f-4BELvlKtCHPBY7s4Bzij9-tLlRq5sLoE7rq0ES6vQZ9JCjAbwB9ldoAmsS6gz0vMhclXwRs2kHIT-VKYAbKvIrKpMftwh0VNIwegccmcSuGRPJw-VoOqMchzkKXz9z6rDvy7I0Mv0BD2AistlSd8QBSPW0IGWIRFeXYyMNGMwKJ1LxBGBDWAnksob9RUSZTbls0bT6e9uWewSSPgK91M0LZtUwQZmFbqm-3cF6m5Yl3YaQtMODOq69OiHw",
        },
      }
    );
    console.log(response);
    if (!response?.error) {
      setDataICD(response?.data?.destinationEntities);
    }
  };
  console.log(dataICD);
  return (
    <Box width={"full"} p="4">
      <HStack>
        <Heading>{fetchUser?.name}</Heading>
        <Text>{fetchUser?.relation}</Text>
      </HStack>
      <Divider my={"2"} />
      <Heading my="4">Medical Records</Heading>
      <SimpleGrid columns={2} minChildWidth={"400px"} spacing={16}>
        <Box
          py={"8"}
          px={"4"}
          width={{ base: "full", md: "450px" }}
          boxShadow={"lg"}
          background="green.50"
        >
          <Text
            mt={"-5"}
            fontWeight={"bold"}
            fontSize={"xl"}
            color={"gray.800"}
          >
            Diagnosis # 1
          </Text>
          <Divider mb={"3"} />
          <form onSubmit={handleSubmit(SubmitHandler)}>
            <VStack align={"stretch"} spacing="8">
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
                        key={`prescription-${key}`}
                        src={item}
                        height="200"
                        width="200"
                      />
                    ))}
                </SimpleGrid>
                <VStack align={"stretch"}>
                  <FormLabel>
                    Select the disease you're diagnosed with:
                  </FormLabel>
                  <HStack>
                    <Input
                      size={"lg"}
                      placeholder="search for related diseases..."
                      type="text"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                    <Button size="lg" colorScheme={"green"} onClick={queryICD}>
                      Search
                    </Button>
                  </HStack>
                  {dataICD?.length > 0 && (
                    <VStack
                      align={"stretch"}
                      zIndex={2}
                      height={"200px"}
                      overflowY={"scroll"}
                    >
                      {dataICD?.map((item: any, key: any) => (
                        <Box
                          mt="4"
                          key={key}
                          dangerouslySetInnerHTML={{ __html: item?.title }}
                        />
                      ))}
                    </VStack>
                  )}
                </VStack>
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
        {/* <Center
          background={"green.50"}
          border={"2px"}
          borderStyle={"dashed"}
          borderColor={"gray.500"}
          height={"300px"}
          width={{ base: "full", md: "400px" }}
          cursor="pointer"
          _hover={{
            boxShadow: "lg",
            background: "green.100",
          }}
        >
          <AddIcon boxSize={"full"} color={"gray.600"} p="20" />
        </Center> */}
      </SimpleGrid>
    </Box>
  );
};

export default UserPage;
