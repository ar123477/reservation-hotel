// src/components/common/ImageCarousel.js
import React, { useState } from 'react';

const ImageCarousel = ({ images, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="image-carousel">
      <div className="carousel-container">
        <img 
          src={images[currentIndex]} 
          alt={`${alt} - Image ${currentIndex + 1}`}
          className="carousel-image"
        />
        
        {images.length > 1 && (
          <>
            <button className="carousel-btn prev" onClick={prevImage}>
              ‹
            </button>
            <button className="carousel-btn next" onClick={nextImage}>
              ›
            </button>
            
            <div className="carousel-dots">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageCarousel;