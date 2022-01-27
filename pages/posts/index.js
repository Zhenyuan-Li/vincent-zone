import AllPosts from '../../components/posts/all-posts';
import { getAllPosts } from '../../lib/post-util';

function AllPostsPage(props) {
  const { posts } = props;

  return <AllPosts posts={posts} />;
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
