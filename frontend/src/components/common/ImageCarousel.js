// src/components/common/ImageCarousel.js
import React, { useState } from 'react';

const ImageCarousel = ({ images, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  // Gestion des erreurs d'image
  const handleImageError = (e) => {
    e.target.src = '/images/default-hotel.jpg';
  };

  return (
    <div className="image-carousel">
      <div className="carousel-container">
        <img 
          src={images[currentIndex]} 
          alt={`${alt} - Image ${currentIndex + 1}`}
          onError={handleImageError}
          className="carousel-image"
        />
        
        {images.length > 1 && (
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
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => goToImage(index)}
                  aria-label={`Aller à l'image ${index + 1}`}
                />
              ))}
            </div>
            
            <div className="carousel-counter">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageCarousel;
