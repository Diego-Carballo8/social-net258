import React from 'react';
import PostCard from './PostCard';
import styles from './style.module.css';

const PostList = ({ posts }) => (
  <section className={styles['post-list']}>
    {posts.map(post => (
      <PostCard key={post._id || post.id} post={post} />
    ))}
  </section>
);

export default PostList;