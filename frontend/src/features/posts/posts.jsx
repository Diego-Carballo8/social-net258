// Post.jsx
import React from 'react';
import styles from './style.module.css';

const Post = ({ author, content, date }) => {
    return (
        <div className={styles.miClase}>
            <h3>{author}</h3>
            <p>{content}</p>
            <small>{date}</small>
        </div>
    );
};

export default Post;