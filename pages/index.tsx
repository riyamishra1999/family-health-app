import { Button } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext } from "react";
import { AuthContext } from "../utils/AuthContext";
import { auth } from "../utils/firebase-config";
import withPrivateRoute from "../withPrivateRoute";

const Home: NextPage = () => {
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();
  const handleSignOut = async () => {
    await signOut(auth)
      .then(() => {
        console.log("signout success");
        setUser(null);
        router.push("/login");
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1>Welcome to family health app</h1>
        <Button onClick={handleSignOut}>Logout</Button>
      </main>
    </div>
  );
};

export default withPrivateRoute(Home);
