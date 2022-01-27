import matter from 'gray-matter';

import fs from 'fs';
import path from 'path';

const POSTS_DIRECTORY = path.join(process.cwd(), 'posts');

const getPostData = (fileName) => {
  // find the file -> read the content -> extract the meta data (using gray-matter)
  const filePath = path.join(POSTS_DIRECTORY, fileName);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  // Remove the file extension (.md)
  const postSlug = fileName.replace(/\.md$/, '');

  const postData = {
    slug: postSlug,
    ...data,
    content,
  };
  return postData;
};

export const getAllPosts = () => {
  const postFiles = fs.readdirSync(POSTS_DIRECTORY);
  const allPosts = postFiles.map((postFile) => getPostData(postFile));
  const sortedPosts = allPosts.sort((postA, postB) =>
    postA.date > postB.date ? -1 : 1
  );

  return sortedPosts;
};

export const getFeaturedPosts = () => {
  const allPosts = getAllPosts();
  const featuredPosts = allPosts.filter((post) => post.isFeatured);

  return featuredPosts;
};
