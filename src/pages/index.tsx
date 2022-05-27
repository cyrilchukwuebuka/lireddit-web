import { Link } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { Layout } from "../components/Layout";
import { NavBar } from "../components/NavBar";
import { usePostQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [{data}] = usePostQuery()
  // console.log(data)
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
