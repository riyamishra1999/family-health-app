import {
  Box,
  Button,
  Center,
  Checkbox,
  CheckboxGroup,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import withPrivateRoute from "../../withPrivateRoute";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { API } from "../../utils/api";
import FilePicker from "chakra-ui-file-picker";
import { Controller, useForm } from "react-hook-form";
import {
  InputController,
  TextAreaController,
} from "../../components/molecules/InputController";
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
  const [diagnosis, setDiagnosis] = useState<any>();
  const FetchData = async () => {
    try {
      const response: any = await API.get(`diagnosis/get/${id}`);
      setDiagnosis(response?.response);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(diagnosis, "diag");
  useEffect(() => {
    FetchUser();
    FetchData();
  }, [id]);
  const toast = useToast();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    setValue,
    control,
  } = useForm({
    mode: "all",
  });
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const [tags, setTags] = useState<any>();
  const [loading, setLoading] = useState(false);
  const openHandler = () => {
    onToggle();
    setImageUrl([]);
    setSearchText("");
    setDataICD("");
    setTags(null);
  };
  const SubmitHandler = async (data: any) => {
    setLoading(true);
    const formData = new FormData();
    const reportImages = new FormData();

    if (data?.images) {
      for (var i = 0; i < data.images?.length; i++) {
        reportImages.append("images", data.images[i]);
      }
    }
    formData.append("date", data?.date);
    formData.append("followupDate", data?.followupDate);
    formData.append("tags", tags);
    formData.append("remarks", data?.remarks);
    formData.append("usersUserId", fetchUser?.userId);

    console.log(data);

    try {
      const response: any = await axios.post(
        "http://localhost:5000/diagnosis/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response, "success");
      if (response?.data?.response?.diagnosisId) {
        reportImages.append(
          "diagnosisId",
          response?.data?.response?.diagnosisId
        );
        const reportResponse: any = await axios.post(
          "http://localhost:5000/report/create",
          reportImages,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(reportResponse, "report response");
      }
      toast({
        status: "success",
        title: "Successfully created",
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      console.log(error);
    }
    onToggle();
    FetchData();
    setLoading(false);
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
      `https://id.who.int/icd/entity/search?q=${searchText}&useFlexisearch=false&flatResults=true&highlightingEnabled=false`,
      {
        headers: {
          Accept: "application/json",
          "API-Version": "v2",
          "Accept-Language": "en",
          Authorization:
            "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE2NjU3MTE4NDUsImV4cCI6MTY2NTcxNTQ0NSwiaXNzIjoiaHR0cHM6Ly9pY2RhY2Nlc3NtYW5hZ2VtZW50Lndoby5pbnQiLCJhdWQiOlsiaHR0cHM6Ly9pY2RhY2Nlc3NtYW5hZ2VtZW50Lndoby5pbnQvcmVzb3VyY2VzIiwiaWNkYXBpIl0sImNsaWVudF9pZCI6IjdkNmNjZTEwLTE0ZjYtNDNjNS04MDhhLWE3YTAyNjI4MWQ5Nl8zNTBjM2U0Mi03ODZiLTQ3NDQtYTU2My1jOTI2MzJmOGY4ZTAiLCJzY29wZSI6WyJpY2RhcGlfYWNjZXNzIl19.dOlg5ke82FPJllraNkz8uddKLbn_1HJFZ8Vvefe74CdH4KzGWZPyErLtGE6IyUeLAzHFwP9df2zLfa3J4VSsxv_KNiiWMRfzREtuOko8BpE7OJCE9oB13G_pnIGZXpRmQaYMZRKigjvtDMa89wcBc7FqfxfQequEP29Kl8vMlYim4t_qKuL-jXDAV_nGysI8z0Yf2a1KcLgKQg0yyBA86cfuUE3XPlijlrmxo1Q5ygvncoRAKTqJFZc-HX4v-6TyJSz6Y-DAZjigM4xo0zfzG6wgJ3l9m8zY4trJvlQlBMjnPOIZctERRGRH1T4LMD-BvXW4rHALvY3BvxkaiWynkA",
        },
      }
    );
    console.log(response);
    if (!response?.error) {
      setDataICD(response?.data?.destinationEntities);
    }
  };
  const [showReports, setShowReports] = useState(false);
  console.log(dataICD);
  const showReportsHandler = () => {
    setShowReports(true);
  };

  return (
    <>
      {loading ? (
        <Flex height={"60vh"} width={"full"} justify="center">
          <Spinner size={"xl"} color={"green.500"} thickness={"8px"} mt="32" />
        </Flex>
      ) : (
        <Box width={"full"} p="4">
          <HStack>
            <Heading color={"gray.800"}>{fetchUser?.name}</Heading>
            <Text fontFamily={"mono"} px={2}>
              {fetchUser?.relation}
            </Text>
          </HStack>
          <Divider my={"2"} />
          <SimpleGrid columns={2} minChildWidth={"400px"} spacing={16} mt="4">
            <Center
              background={"green.50"}
              border={"2px"}
              borderStyle={"dashed"}
              borderColor={"gray.500"}
              height={"200px"}
              width={{ base: "full", md: "220px" }}
              cursor="pointer"
              _hover={{
                boxShadow: "xl",
                background: "green.100",
              }}
              onClick={openHandler}
            >
              <VStack>
                <AddIcon boxSize={"16"} color={"gray.600"} />
                <Text>Click here to add a report</Text>
              </VStack>
            </Center>
            <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Add Report Details</ModalHeader>
                <ModalCloseButton />
                <ModalBody p="4" background="green.50">
                  <Box>
                    <Text
                      fontWeight={"bold"}
                      fontSize={"xl"}
                      color={"gray.800"}
                      mb="4"
                      textAlign={"center"}
                    >
                      Diagnosis Report Fill Up
                    </Text>
                    <form onSubmit={handleSubmit(SubmitHandler)}>
                      <VStack align={"stretch"} spacing="4">
                        <FormControl>
                          <FormLabel>Date of Prescription</FormLabel>
                          <InputController
                            register={register}
                            name="date"
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
                                  key={`prescription-r-${key}`}
                                  src={item}
                                  height="200"
                                  width="200"
                                />
                              ))}
                          </SimpleGrid>
                          <VStack align={"stretch"}>
                            <FormLabel mt="3">
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
                              <Button colorScheme={"green"} onClick={queryICD}>
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
                                <CheckboxGroup
                                  onChange={(data: any) => {
                                    setTags(data);
                                    console.log(data);
                                  }}
                                >
                                  {dataICD?.map((item: any, key: any) => (
                                    <Checkbox
                                      key={`data-${key}`}
                                      value={item?.title}
                                    >
                                      <Box
                                        dangerouslySetInnerHTML={{
                                          __html: item?.title,
                                        }}
                                      />
                                    </Checkbox>
                                  ))}
                                </CheckboxGroup>
                              </VStack>
                            )}
                          </VStack>
                          <VStack>
                            <FormControl mt="4">
                              <FormLabel>Follow up Date</FormLabel>
                              <InputController
                                register={register}
                                name="followupDate"
                                type="date"
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>Remarks</FormLabel>
                              <TextAreaController
                                register={register}
                                name="remarks"
                                type="date"
                              />
                            </FormControl>
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
                </ModalBody>
              </ModalContent>
            </Modal>
          </SimpleGrid>
          <Divider my="10" />
          <Box>
            <Heading mb="4" textDecoration={"underline"}>
              Report Timeline
            </Heading>
            <SimpleGrid
              columns={[1, null, 3]}
              minChildWidth={"400px"}
              spacing={"8"}
              p="4"
            >
              {diagnosis?.map((item: any, key: any) => (
                <Box
                  key={`diag-${key}`}
                  width="450px"
                  height="300px"
                  background={"green.50"}
                  borderWidth={"2px"}
                  borderColor={"green.100"}
                  rounded={"md"}
                  boxShadow={"md"}
                  position={"relative"}
                >
                  <VStack align="stretch" p="2" spacing="6">
                    <Heading color={"gray.800"} fontSize={"2xl"}>
                      {item?.date}
                    </Heading>
                    <Divider />
                    <VStack>
                      <Text fontSize={"lg"} fontWeight="semibold">
                        Diagnosed with:
                      </Text>
                      <Text fontFamily={"mono"} p="4">
                        {item?.tags}
                      </Text>
                    </VStack>
                    <Divider />
                    <Button
                      colorScheme={"green"}
                      position={"absolute"}
                      bottom={"3"}
                      width={"350px"}
                      alignSelf={"center"}
                      onClick={() => showReportsHandler()}
                    >
                      Click to see more
                    </Button>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
            <Modal
              size="6xl"
              motionPreset="slideInBottom"
              isOpen={showReports}
              onClose={() => setShowReports(false)}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Report of {fetchUser?.name} on</ModalHeader>
                <ModalCloseButton />
                <ModalBody></ModalBody>
              </ModalContent>
            </Modal>
          </Box>
        </Box>
      )}
    </>
  );
};

export default withPrivateRoute(UserPage);
