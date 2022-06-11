import { Box, Heading } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { Layout } from "../../components/Layout";
import { usePostQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";

export const Post: React.FC<{}> = ({}) => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [{ data, error, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      postId: intId,
    },
  });

  if (fetching) return <Layout>loading...</Layout>;

  if (error) {
    console.log(error.message);
    return <Layout>{error.message}</Layout>;
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>could not find post</Box>
      </Layout>
    );
  }
  console.log(data.post)

  return (
    <Layout>
      <Heading mb={4}>{data?.post?.title}</Heading>
      {data?.post?.text}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Post);
