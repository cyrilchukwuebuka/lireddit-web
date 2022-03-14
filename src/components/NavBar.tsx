import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{fetching: logoutFetching}, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery();
  console.log(data)
  let body: JSX.Element | null = null;

  // data is loading
  if (fetching) {
    // console.log("data.me.username");
  } else if (!data?.me) {
    // user not logged in
    console.log("data.me.username");
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
        <Flex>
            <Box mr={2}>{data.me.username}</Box>
            <Button onClick={() => {
              logout();
            }} isLoading={logoutFetching} variant='link'>logout</Button>
        </Flex>
    )
  }
  return (
    <Flex bg="tan" p={4}>
      <Box p={4} ml="auto">
        {body}
      </Box>
    </Flex>
  );
};
