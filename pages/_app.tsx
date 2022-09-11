import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider, useToast } from "@chakra-ui/react";
import { AuthProvider } from "../utils/AuthContext";
import Layout from "../components/organisms/Layout";
import { useEffect, useState } from "react";
import { auth } from "../utils/firebase-config";
import { signOut } from "firebase/auth";
function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<any>();
  const toast = useToast();
  const initialLoad = () => {
    auth.onAuthStateChanged(async (user: any) => {
      try {
        if (user && !user?.emailVerified) {
          setUser(null);
          await signOut(auth);
          toast({
            title: "Email verification",
            description: "Please verify your email. Kindly check your inbox",
            status: "warning",
          });
        } else {
          setUser(user);
        }
      } catch (error) {}
    });
  };
  useEffect(() => {
    initialLoad();
  }, []);
  return (
    <ChakraProvider>
      <AuthProvider>
        <Layout user={user}>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default MyApp;
