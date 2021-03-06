import { Box, Heading } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";
import { Layout } from "../../components/Layout";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";

export const Post: React.FC<{}> = ({}) => {
  const [{ data, error, fetching }] = useGetPostFromUrl();

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

  return (
    <Layout>
      <Heading mb={4}>{data?.post?.title}</Heading>
      <Box mb={4}>{data?.post?.text}</Box>
      <EditDeletePostButtons
        id={data.post._id}
        creatorId={data.post.creatorId}
      />
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Post);
