import PostGrid from '../posts/post-grid';
import classes from './featured-posts.module.css';

function FeaturedPosts(props) {
  const { posts } = props;
  return (
    <section className={classes.latest}>
      <h2>Featured Posts</h2>
      <PostGrid posts={posts} />
    </section>
  );
}

export default FeaturedPosts;
