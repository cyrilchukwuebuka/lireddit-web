import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useState } from "react";
import { Layout } from "../components/Layout";
import { useDeletePostMutation, useMeQuery, usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { UpdootSection } from "../components/UpdootSection";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });
  const [{data: meData}] = useMeQuery()
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });
  const [_, deletePost] = useDeletePostMutation();

  if (!fetching && !data) {
    return <div>Query failed for some reason</div>;
  }

  return (
    <Layout>
      {!data && fetching ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data?.posts.posts.map((post) =>
            !post ? null : (
              <Flex key={post._id} p={5} shadow="md" borderWidth="1px">
                <UpdootSection post={post} />
                <Box flex={1}>
                  <NextLink href="/post/[id]" as={`/post/${post._id}`}>
                    <Link>
                      <Heading fontSize="xl">{post.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text> posted by {post.creator.username}</Text>
                  <Flex align="center">
                    <Text flex={1} mt={4}>
                      {post.textSnippet.concat("...")}
                    </Text>
                    {meData?.me?._id === post.creator._id && <Box ml="auto">
                      <NextLink href='/post/edit/[id]' as={`/post/edit/${post._id}`}>
                        <IconButton
                          as={Link}
                          mr={4}
                          aria-label="Edit post"
                          icon={<EditIcon />}
                        />
                      </NextLink>
                      <IconButton
                        onClick={() => {
                          deletePost({ postId: post._id });
                        }}
                        aria-label="delete post"
                        icon={<DeleteIcon />}
                      />
                    </Box>}
                  </Flex>
                </Box>
              </Flex>
            )
          )}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
            isLoading={fetching}
            m="auto"
            my={8}
          >
            load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

// export default Index;
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
