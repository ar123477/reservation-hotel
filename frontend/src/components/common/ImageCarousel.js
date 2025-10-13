
// src/components/common/ImageCarousel.js - VERSION ROBUSTE
import React, { useState } from 'react';

const ImageCarousel = ({ images, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // S'assurer que images est toujours un tableau
  const safeImages = Array.isArray(images) && images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop'
  ];

  const nextImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === safeImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? safeImages.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  // Gestion robuste des erreurs d'image
  const handleImageError = (e) => {
    console.error('Image failed to load:', e.target.src);
    e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop';
  };

  return (
    <div className="image-carousel">
      <div className="carousel-container">
        <img 
          src={safeImages[currentIndex]} 
          alt={`${alt} - Image ${currentIndex + 1}`}
          onError={handleImageError}
          className="carousel-image"
        />
        
        {safeImages.length > 1 && (
          <>
            <button 
              className="carousel-btn prev-btn" 
              onClick={prevImage}
              aria-label="Image précédente"
            >
              ‹
            </button>
            <button 
              className="carousel-btn next-btn" 
              onClick={nextImage}
              aria-label="Image suivante"
            >
              ›
            </button>
            
            <div className="carousel-indicators">
              {safeImages.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => goToImage(index)}
                  aria-label={`Aller à l'image ${index + 1}`}
                />
              ))}
            </div>
            
            <div className="carousel-counter">
              {currentIndex + 1} / {safeImages.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageCarousel;

