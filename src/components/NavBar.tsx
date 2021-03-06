import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{fetching: logoutFetching}, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    // using the commented code below allows for the meQuery to
    // make a client side request directly to the server 
    // it's useful when the cookie option is not present in the fetchOptions

    pause: isServer
  });
  let body: JSX.Element | null = null;

  // data is loading
  if (fetching) {
    // console.log("data.me.username");
  } else if (!data?.me) {
    // user not logged in
    body = (
      <>
        <NextLink href="/login">
          <Link mr={4} color="white">
            login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="white">register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex align='center'>
        <NextLink href="/create-post">
          <Button as={Link} mr={2}>create post</Button>
        </NextLink>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={() => {
            logout();
          }}
          isLoading={logoutFetching}
          variant="link"
        >
          logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex position="sticky" top={0} zIndex={1} bg="tan" p={4}>
      <NextLink href="/">
        <Link>
          <Heading fontSize="xl">LiReddit</Heading>
        </Link>
      </NextLink>
      <Box ml="auto">
        {body}
      </Box>
    </Flex>
  );
};
