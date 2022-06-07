import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React from "react";
import { PostSnippetFragment } from "../generated/graphql";

interface UpdootSectionProps {
    post: PostSnippetFragment
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  return (
    <Flex direction="column" mr={4} align="center" justify='center'>
      <IconButton aria-label="updoot post" icon={<ChevronUpIcon h="24px" />} />
      {post.points}
      <IconButton
        aria-label="downdoot post"
        icon={<ChevronDownIcon h="24px" />}
      />
    </Flex>
  );
};
