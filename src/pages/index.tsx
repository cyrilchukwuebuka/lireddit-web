import { Link } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { Layout } from "../components/Layout";
import { usePostQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [{data}] = usePostQuery({
    variables: {
      limit: 10
    }
  });

  return (
    <Layout>
      <NextLink href="/create-post">
        <Link>create post</Link>
      </NextLink>
      <div>Hello World</div>
      {!data ? null : data.posts.map(p => <div key={p._id}>{p.title}</div>)}
    </Layout>
  );
};

// export default Index;
export default withUrqlClient(createUrqlClient, {ssr: true})(Index);
