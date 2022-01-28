import Head from 'next/head';

import AllPosts from '../../components/posts/all-posts';
import { getAllPosts } from '../../lib/post-util';

function AllPostsPage(props) {
  const { posts } = props;

  return (
    <>
      <Head>
        <title>All Posts</title>
        <meta
          name="description"
          content="A list of program-related blogs and posts"
        />
      </Head>
      <AllPosts posts={posts} />
    </>
  );
}

export default AllPostsPage;

export const getStaticProps = async (ctx) => {
  const allPosts = getAllPosts();

  return {
    props: {
      posts: allPosts,
    },
  };
};
