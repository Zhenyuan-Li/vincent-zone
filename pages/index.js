import Head from 'next/head';

import Hero from '../components/home-page/hero';
import FeaturedPosts from '../components/home-page/featured-posts';
import { getFeaturedPosts } from '../lib/post-util';

function HomePage(props) {
  const { posts } = props;

  return (
    <>
      <Head>
        <title>Vincent Blog</title>
        <meta name="description" content="I, me, myself" />
      </Head>
      <Hero />
      <FeaturedPosts posts={posts} />
    </>
  );
}

export default HomePage;

export const getStaticProps = async (ctx) => {
  const featuredPosts = getFeaturedPosts();

  return {
    props: {
      posts: featuredPosts,
    },
    // revalidate: 1800,
  };
};
