import matter from 'gray-matter';

import fs from 'fs';
import path from 'path';

const POSTS_DIRECTORY = path.join(process.cwd(), 'content');

export const getPostFiles = () => {
  return fs.readdirSync(POSTS_DIRECTORY);
};

export const getPostData = (postIdentifier) => {
  // find the file -> read the content -> extract the meta data (using gray-matter)
  // Remove the file extension (.md)
  const postSlug = postIdentifier.replace(/\.md$/, '');
  const filePath = path.join(POSTS_DIRECTORY, `${postSlug}.md`);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  const postData = {
    slug: postSlug,
    ...data,
    content,
  };
  return postData;
};

export const getAllPosts = () => {
  const postFiles = getPostFiles();
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
