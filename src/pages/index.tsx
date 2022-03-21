import { withUrqlClient } from "next-urql";
import { NavBar } from "../components/NavBar";
import { usePostQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [{data}] = usePostQuery()
  console.log(data)
  return (
    <>
      <NavBar />
      <div>Hello World</div>
      {!data ? null : data.posts.map(p => <div key={p._id}>{p.title}</div>)}
    </>
  );
};

// export default Index;
export default withUrqlClient(createUrqlClient, {ssr: true})(Index);
