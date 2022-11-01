import {
  Avatar,
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
  LinkBox,
  LinkOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Stack,
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
import { BearerToken } from "../../utils/icdToken";
import { FiMessageSquare, FiShare } from "react-icons/fi";
import { saveAs } from "file-saver";
const UserPage = () => {
  const router = useRouter();
  const id = router.query.id;
  const [fetchUser, setFetchUser] = useState<any>();
  const [selectedReports, setSelectedReports] = useState<any>();
  const FetchUser = async () => {
    const response: any = await API.get(`/user/${id}`);
    console.log(response, "rsss");
    setFetchUser(response?.data);
  };
  const [diagnosis, setDiagnosis] = useState<any>();
  const FetchData = async () => {
    try {
      const response: any = await API.get(`/diagnosis/get/${id}`);
      setDiagnosis(response?.response);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(diagnosis, "diag");
  useEffect(() => {
    FetchUser();
    FetchData();
  }, []);
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
  const [showMultipleReports, setShowMultipleReports] = useState(false);
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

  const queryICD = async () => {
    const response: any = await axios.get(
      `https://id.who.int/icd/entity/search?q=${searchText}&useFlexisearch=false&flatResults=true&highlightingEnabled=false`,
      {
        headers: {
          Accept: "application/json",
          "API-Version": "v2",
          "Accept-Language": "en",
          Authorization: BearerToken,
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
  const [reports, setReports] = useState<any>();
  const [diag, setDiag] = useState<any>();
  const [tag, setTag] = useState<any>();
  const giveMeFoundationURL = async (tag: any): Promise<any> => {
    return await axios.get(
      `https://id.who.int/icd/entity/search?q=${tag}&useFlexisearch=false&flatResults=true&highlightingEnabled=false`,
      {
        headers: {
          Accept: "application/json",
          "API-Version": "v2",
          "Accept-Language": "en",
          Authorization: BearerToken,
        },
      }
    );
  };
  const showReportsHandler = async (id: any, e: any) => {
    e.preventDefault();
    setShowReports(true);
    const diagResponse: any = await API.get(`/diagnosis/one/${id}`);
    const resPDiag = await diagResponse?.response;
    setDiag(resPDiag);
    const diagTags = await resPDiag?.tags?.split(",");
    setTag(diagTags);
    console.log(diagTags, "opp");
    const response: any = await API.get(`/report/get/${id}`);
    setReports(await response?.response);
    if (diagTags?.length > 0) {
      const finalResp = Promise.all(
        diagTags?.map(async (item: string, key: any) => {
          const myURL = await giveMeFoundationURL(item);
          const responseId: string = await myURL?.data?.destinationEntities[0]
            ?.id;
          console.log(responseId, "url link");
          return {
            key: key,
            name: item,
            url: "https://icd.who.int/dev11/f/en#/" + responseId,
          };
        })
      );

      const resp = await finalResp;
      setTag(resp);
    }
  };
  console.log(tag, "diagResponse");
  console.log(diag, reports, "download request>>>");
  const downloadHandler = async (e: any, id: any) => {
    console.log(id, "downloading");
    e.preventDefault();
    const resp: any = await API.post(
      `/download/create-form/${id}`,
      {
        fetchUser,
        diag,
        reports,
      },
      {
        responseType: "blob",
      }
    );
    console.log(resp, "response");
    if (resp) {
      const pdfBlob = new Blob([resp], { type: "application/pdf" });
      saveAs(pdfBlob, `${fetchUser?.name}-report.pdf`);
    }
  };
  const downloadMultipleReports = async () => {
    console.log(selectedReports);
    if (selectedReports?.length > 0) {
      var obj = [];
      for (var i = 0; i < selectedReports.length; i++) {
        const diagresp: any = await API.get(
          `/diagnosis/one/${selectedReports[i]}`
        );
        console.log(diagresp, "diagresponse>>>");
        const reportresp: any = await API.get(
          `/report/get/${selectedReports[i]}`
        );
        const finaldiag = await diagresp?.response;
        const finalreport = await reportresp?.response;
        var final = { ...finaldiag, ...finalreport };
        obj.push(final);
      }
      console.log(obj, "final object");
    }
  };
  const multipleReportsHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log("downloading");
    setShowMultipleReports(!showMultipleReports);
  };
  return (
    <>
      {loading ? (
        <Flex height={"60vh"} width={"full"} justify="center">
          <Spinner size={"xl"} color={"green.500"} thickness={"8px"} mt="32" />
        </Flex>
      ) : (
        <Box width={"full"} p="4">
          <Flex justify={"space-between"} align={"center"} w={"full"}>
            <HStack>
              <Heading color={"gray.800"}>{fetchUser?.name}</Heading>
              <Text fontFamily={"mono"} px={2}>
                {fetchUser?.relation}
              </Text>
            </HStack>
            <Avatar src={fetchUser?.image} size="xl" name={fetchUser?.name} />
          </Flex>
          <Divider my={"2"} />
          <SimpleGrid columns={2} minChildWidth={"400px"} spacing={16} mt="4">
            <Center
              mx={"4"}
              rounded={"md"}
              background={"blue.50"}
              border={"2px"}
              borderStyle={"dashed"}
              borderColor={"gray.500"}
              height={"200px"}
              width={{ base: "full", md: "200px" }}
              cursor="pointer"
              _hover={{
                boxShadow: "xl",
                background: "blue.100",
                transitionDuration: "500ms",
              }}
              onClick={openHandler}
            >
              <VStack>
                <AddIcon boxSize={"20"} color={"gray.600"} />
                <Text p="4">Click here to add a report</Text>
              </VStack>
            </Center>
            <Modal isOpen={isOpen} onClose={onClose} size={"2xl"}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Add Report Details</ModalHeader>
                <ModalCloseButton />
                <ModalBody p="4" background="gray.50">
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
                              <Button
                                colorScheme={"twitter"}
                                onClick={queryICD}
                              >
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
                          colorScheme="twitter"
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
            <Heading mb="4" color={"gray.800"}>
              Report Timeline
            </Heading>
            <Divider />
            <Flex>
              <Button
                my="2"
                size="sm"
                variant={"ghost"}
                colorScheme="blue"
                ml="auto"
                onClick={(e) => multipleReportsHandler(e)}
              >
                Click here to download multiple reports
              </Button>
            </Flex>
            <SimpleGrid
              columns={[1, null, 3]}
              minChildWidth={"400px"}
              spacing={"8"}
              p="4"
            >
              {diagnosis?.map((item: any, key: any) => (
                <Box
                  key={`diag-${key}`}
                  width={{ base: "full", md: "450px" }}
                  height="300px"
                  background={"blue.50"}
                  borderWidth={"2px"}
                  borderColor={"blue.100"}
                  rounded={"md"}
                  boxShadow={"md"}
                  position={"relative"}
                >
                  <VStack align="stretch" p="2" spacing="4">
                    <Heading
                      color={"gray.600"}
                      fontSize={"2xl"}
                      pl={"4"}
                      pt="2"
                    >
                      {item?.date}
                    </Heading>
                    <Divider />
                    <VStack>
                      <Text
                        fontSize={"lg"}
                        fontWeight="semibold"
                        color={"gray.600"}
                      >
                        Diagnosed with:
                      </Text>
                      <Text fontFamily={"mono"} p="4">
                        {item?.tags}
                      </Text>
                    </VStack>
                    <Divider />
                    <Button
                      colorScheme={"twitter"}
                      position={"absolute"}
                      bottom={"3"}
                      width={"350px"}
                      alignSelf={"center"}
                      onClick={(e) => showReportsHandler(item?.diagnosisId, e)}
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
                <ModalHeader fontWeight={"bold"}>
                  Report of {fetchUser?.name} on {diag?.date}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody px="4" py="2">
                  {reports?.length > 0 &&
                    reports?.map((item: any, key: any) => (
                      <Box py="2">
                        <img
                          src={item?.reportURL}
                          key={key}
                          alt={`report-${key}`}
                        />
                      </Box>
                    ))}
                  <HStack>
                    <Text fontWeight={"semibold"}>Diagnosed with:</Text>
                    <Stack direction={["column", "row"]} spacing="24px">
                      {tag?.length > 0 &&
                        tag?.map((item: any, key: any) => (
                          <LinkBox
                            key={key}
                            as="article"
                            maxW="sm"
                            p="2"
                            borderWidth="1px"
                            rounded="md"
                            _hover={{
                              boxShadow: "sm",
                              textDecoration: "underline",
                            }}
                          >
                            <Heading size="sm" my="2">
                              <LinkOverlay href={item?.url} target={"_blank"}>
                                {item?.name}
                              </LinkOverlay>
                            </Heading>
                          </LinkBox>
                        ))}
                    </Stack>
                  </HStack>
                  <HStack py="2">
                    <Text fontWeight={"semibold"}>Follow up Date:</Text>
                    <Text>{diag?.followupDate}</Text>
                  </HStack>
                  <HStack py="2">
                    <Text fontWeight={"semibold"}>Remarks:</Text>
                    <Text>{diag?.remarks}</Text>
                  </HStack>
                </ModalBody>
                <ModalFooter>
                  <Flex justify={"flex-end"} gap={"2"}>
                    <Button colorScheme={"gray"} leftIcon={<FiMessageSquare />}>
                      Send to mail
                    </Button>
                    <Button
                      colorScheme={"blue"}
                      justifySelf={"end"}
                      onClick={(e) => downloadHandler(e, diag?.diagnosisId)}
                    >
                      Download Report
                    </Button>
                  </Flex>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <Modal
              size="6xl"
              motionPreset="slideInBottom"
              isOpen={showMultipleReports}
              onClose={() => setShowMultipleReports(false)}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader fontWeight={"bold"}>
                  Please Select the Reports:
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody px="4" py="2">
                  <CheckboxGroup
                    onChange={(data: any) => setSelectedReports(data)}
                  >
                    <VStack align="stretch">
                      {diagnosis?.map((item: any, key: any) => (
                        <Checkbox key={key} value={item?.diagnosisId} size="lg">
                          <Text>Diagnosis on {item?.date}</Text>
                        </Checkbox>
                      ))}
                    </VStack>
                  </CheckboxGroup>
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme={"blue"}
                    onClick={downloadMultipleReports}
                  >
                    Download Reports
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
        </Box>
      )}
    </>
  );
};

export default withPrivateRoute(UserPage);
