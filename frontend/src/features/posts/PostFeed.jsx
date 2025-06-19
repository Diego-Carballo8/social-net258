import React, { useState } from 'react';
import CreatePost from './CreatePost';
import PostList from './PostList';

const PostFeed = ({ posts, onPostCreated }) => {
  // Si quieres manejar el estado aquí, descomenta las siguientes líneas:
  // const [posts, setPosts] = useState(initialPosts || []);
  // const handleNewPost = (newPost) => setPosts([newPost, ...posts]);

  return (
    <div>
      {/* Formulario para crear publicación */}
      <CreatePost onCreate={onPostCreated} />
      {/* Lista de publicaciones */}
      <PostList posts={posts} />
    </div>
  );
};

export default PostFeed;