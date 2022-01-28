import Head from 'next/head';

import PostContent from '../../components/posts/post-detail/post-content';
import { getPostData, getPostFiles } from '../../lib/post-util';

// human readable search engine friendly routes: slug
function PostDetailPage(props) {
  const { post } = props;

  return (
    <>
      <Head>
        <title>{props.post.title}</title>
        <meta name="description" content={post.excerpt} />
      </Head>
      <PostContent post={post} />
    </>
  );
}

export default PostDetailPage;

export const getStaticProps = async (ctx) => {
  const { params } = ctx;
  const { slug } = params;

  const postData = getPostData(slug);

  return {
    props: {
      post: postData,
    },
    revalidate: 600,
  };
};

export const getStaticPaths = async () => {
  const postFileNames = getPostFiles();

  const slugs = postFileNames.map((fileName) => fileName.replace(/\.md$/, ''));

  return {
    // since not all of posts are need to pre-rendered
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};
