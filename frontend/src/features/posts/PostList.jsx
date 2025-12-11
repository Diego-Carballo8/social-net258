import React from 'react';
import PostCard from './PostCard';
import styles from './style.module.css';

const PostList = ({ posts, onDelete }) => (
  <section className={styles['post-list']}>
    {posts.map(post => (
      <PostCard key={post._id || post.id} post={post} onDelete={onDelete} />
    ))}
  </section>
);

export default PostList;