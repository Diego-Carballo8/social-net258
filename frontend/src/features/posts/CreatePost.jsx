import React, { useState, useRef } from 'react';
import styles from './style.module.css';

const API_BASE_URL = 'http://localhost:3000/api/v1/post';

const CreatePost = ({ onCreate }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const dropRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Enviar como FormData para incluir imagen
      const formData = new FormData();
      formData.append('content', content);
      if (image) formData.append('image', image);

      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // FormData maneja enctype automáticamente
      });

      if (!res.ok) throw new Error('Error al crear la publicación');
      const newPost = await res.json();

      if (onCreate) onCreate(newPost);
      setContent('');
      setImage(null);
      setImagePreview(null);
      window.location.href = '/';
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.createPostContainer}>
      <div className={styles.createPostCard}>
        <h2>Crear una publicación</h2>
        <form onSubmit={handleSubmit} className={styles.createPostForm}>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="¿Qué estás pensando?"
            rows={4}
            disabled={loading}
            className={styles.postTextarea}
          />
          <div
            className={`${styles.imageUploadSection} ${isDragOver ? styles.dragOver : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            ref={dropRef}
          >
            <label htmlFor="image-input" className={styles.imageLabel}>
              📷 Añadir imagen
            </label>
            <input
              id="image-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
              className={styles.imageInput}
            />

            <div className={styles.hintText}>
              Arrastra una imagen aquí o haz clic para seleccionar
            </div>
          </div>

          {imagePreview && (
            <div className={styles.imagePreviewContainer}>
              <img
                src={imagePreview}
                alt="preview"
                className={styles.imagePreview}
                onClick={() => {
                  setLightboxSrc(imagePreview);
                  setLightboxOpen(true);
                }}
              />
              <button
                type="button"
                onClick={removeImage}
                disabled={loading}
                className={styles.removeImageBtn}
                aria-label="Remover imagen"
              >
                ✕
              </button>
            </div>
          )}

          {lightboxOpen && (
            <div className={styles.lightbox} onClick={() => setLightboxOpen(false)}>
              <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                <img src={lightboxSrc} alt="full" />
                <button className={styles.lightboxClose} onClick={() => setLightboxOpen(false)}>✕</button>
              </div>
            </div>
          )}

          <div className={styles.actionRow}>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className={styles.submitBtn}
            >
              {loading ? 'Publicando...' : '🚀 Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;